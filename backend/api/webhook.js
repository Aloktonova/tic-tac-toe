import crypto from "node:crypto";

const MAX_INVOICE_PAYLOAD_AGE_MS = 24 * 60 * 60 * 1000;
const PRODUCT_CATALOG = Object.freeze({
  galaxy: { id: "galaxy", name: "Galaxy", stars: 35 },
  sakura: { id: "sakura", name: "Sakura", stars: 35 },
  ocean: { id: "ocean", name: "Ocean", stars: 35 },
  forest: { id: "forest", name: "Forest", stars: 35 },
  fire: { id: "fire", name: "Fire", stars: 35 },
  aurora: { id: "aurora", name: "Aurora", stars: 35 },
  samurai: { id: "samurai", name: "Samurai", stars: 35 },
  moonlight: { id: "moonlight", name: "Moonlight", stars: 35 },
  meadow: { id: "meadow", name: "Meadow", stars: 35 },
  castle: { id: "castle", name: "Dark Castle", stars: 35 },
  neon: { id: "neon", name: "Neon City", stars: 35 }
});

function isValidTelegramUserId(userId) {
  return typeof userId === "string" && /^[0-9]{1,20}$/.test(userId);
}

function timingSafeEqualString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function verifyWebhookSecret(req, expectedSecret) {
  const receivedSecret =
    req.headers?.["x-telegram-bot-api-secret-token"];
  return timingSafeEqualString(receivedSecret, expectedSecret);
}

function buildPayloadSignature(secret, payloadData) {
  return crypto.createHmac("sha256", secret)
    .update(payloadData)
    .digest("base64url")
    .slice(0, 22);
}

function verifyInvoicePayload(payload, secret) {
  if (typeof payload !== "string") return null;
  const parts = payload.split(":");
  if (parts.length !== 6 || parts[0] !== "v1") return null;

  const wallpaperId = parts[1];
  const userId = parts[2];
  const issuedAtMs = Number(parts[3]);
  const nonce = parts[4];
  const signature = parts[5];

  if (!PRODUCT_CATALOG[wallpaperId]) return null;
  if (!isValidTelegramUserId(userId)) return null;
  if (!Number.isFinite(issuedAtMs) || issuedAtMs <= 0) return null;
  if (Date.now() - issuedAtMs > MAX_INVOICE_PAYLOAD_AGE_MS) return null;
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(nonce)) return null;
  if (!/^[A-Za-z0-9_-]{10,40}$/.test(signature)) return null;

  const payloadData = "v1|" + wallpaperId + "|" + userId
    + "|" + issuedAtMs + "|" + nonce;
  const expectedSignature = buildPayloadSignature(secret, payloadData);
  if (!timingSafeEqualString(signature, expectedSignature)) {
    return null;
  }

  return { wallpaperId, userId, issuedAtMs };
}

async function answerPreCheckoutQuery({ botToken, queryId, ok, errorMessage }) {
  await fetch(
    `https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pre_checkout_query_id: queryId,
        ok,
        error_message: ok ? undefined : (errorMessage || "Invalid invoice")
      })
    }
  );
}

async function isPaymentAlreadyProcessed({ dbUrl, chargeId }) {
  const existing = await fetch(`${dbUrl}/payments/${chargeId}.json`);
  if (!existing.ok) {
    throw new Error("Could not read payment state");
  }
  const existingBody = await existing.json();
  return existingBody !== null;
}

async function writeVerifiedEntitlement({
  dbUrl, chargeId, userId, wallpaperId, amount, currency
}) {
  await fetch(
    `${dbUrl}/payments/${chargeId}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chargeId,
        userId,
        wallpaperId,
        amount,
        currency,
        verified: true,
        createdAt: Date.now()
      })
    }
  );
  await fetch(
    `${dbUrl}/users/${userId}/ownedWallpapers/${wallpaperId}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: "true"
    }
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
  const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
  const PAYMENT_PAYLOAD_SECRET = process.env.PAYMENT_PAYLOAD_SECRET;
  if (!BOT_TOKEN || !FIREBASE_DATABASE_URL || !TELEGRAM_WEBHOOK_SECRET
    || !PAYMENT_PAYLOAD_SECRET) {
    console.error("Webhook env missing");
    return res.status(200).json({ ok: true });
  }

  if (!verifyWebhookSecret(req, TELEGRAM_WEBHOOK_SECRET)) {
    return res.status(401).json({ error: "Unauthorized webhook" });
  }

  try {
    const update = req.body || {};

    if (update.pre_checkout_query) {
      const query = update.pre_checkout_query;
      const parsed = verifyInvoicePayload(
        query.invoice_payload,
        PAYMENT_PAYLOAD_SECRET
      );
      const product = parsed
        ? PRODUCT_CATALOG[parsed.wallpaperId]
        : null;
      const isValidAmount = !!product
        && query.currency === "XTR"
        && Number(query.total_amount) === product.stars;
      const isValidUser = !!parsed
        && String(query.from?.id || "") === parsed.userId;
      const ok = !!parsed && isValidAmount && isValidUser;
      await answerPreCheckoutQuery({
        botToken: BOT_TOKEN,
        queryId: query.id,
        ok,
        errorMessage: "Payment validation failed"
      });
      return res.status(200).json({ ok: true });
    }

    const payment = update.message?.successful_payment;
    if (!payment) {
      return res.status(200).json({ ok: true });
    }

    const chargeId = payment.telegram_payment_charge_id;
    const parsedPayload = verifyInvoicePayload(
      payment.invoice_payload,
      PAYMENT_PAYLOAD_SECRET
    );
    if (!parsedPayload || typeof chargeId !== "string" || !chargeId.trim()) {
      return res.status(200).json({ ok: true });
    }

    const product = PRODUCT_CATALOG[parsedPayload.wallpaperId];
    if (!product
      || payment.currency !== "XTR"
      || Number(payment.total_amount) !== product.stars) {
      return res.status(200).json({ ok: true });
    }

    const messageFromId = String(update.message?.from?.id || "");
    if (messageFromId !== parsedPayload.userId) {
      return res.status(200).json({ ok: true });
    }

    if (await isPaymentAlreadyProcessed({
      dbUrl: FIREBASE_DATABASE_URL,
      chargeId
    })) {
      return res.status(200).json({ ok: true });
    }

    await writeVerifiedEntitlement({
      dbUrl: FIREBASE_DATABASE_URL,
      chargeId,
      userId: parsedPayload.userId,
      wallpaperId: parsedPayload.wallpaperId,
      amount: product.stars,
      currency: "XTR"
    });

    return res.status(200).json({ ok: true });

  } catch(e) {
    console.error("Webhook error");
    return res.status(200).json({ ok: true });
  }
}
