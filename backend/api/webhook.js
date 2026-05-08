import crypto from "node:crypto";
import { PRODUCT_CATALOG } from "./_product-catalog.js";

const MAX_INVOICE_PAYLOAD_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_INVOICE_PAYLOAD_FUTURE_SKEW_MS = 5 * 60 * 1000;
const SIGNATURE_LENGTH = 22;

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
    .slice(0, SIGNATURE_LENGTH);
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
  const now = Date.now();
  if (now - issuedAtMs > MAX_INVOICE_PAYLOAD_AGE_MS) return null;
  if (issuedAtMs - now > MAX_INVOICE_PAYLOAD_FUTURE_SKEW_MS) return null;
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(nonce)) return null;
  if (signature.length !== SIGNATURE_LENGTH) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(signature)) return null;

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
  const existing = await fetch(
    `${dbUrl}/payments/${encodeURIComponent(chargeId)}.json`
  );
  if (!existing.ok) {
    throw new Error(
      `Could not read payment state for charge ${chargeId} (status ${existing.status})`
    );
  }
  const existingBody = await existing.json();
  return existingBody !== null;
}

async function writeVerifiedEntitlement({
  dbUrl, chargeId, userId, wallpaperId, amount, currency
}) {
  const createdAt = Date.now();
  const patchRes = await fetch(
    `${dbUrl}/.json`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        [`payments/${chargeId}`]: {
          chargeId,
          userId,
          wallpaperId,
          amount,
          currency,
          verified: true,
          createdAt
        },
        [`users/${userId}/ownedWallpapers/${wallpaperId}`]: true
      })
    }
  );
  if (!patchRes.ok) {
    throw new Error(
      `Could not persist verified entitlement for charge ${chargeId} (status ${patchRes.status})`
    );
  }
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
    const missing = [];
    if (!BOT_TOKEN) missing.push("BOT_TOKEN");
    if (!FIREBASE_DATABASE_URL) missing.push("FIREBASE_DATABASE_URL");
    if (!TELEGRAM_WEBHOOK_SECRET) missing.push("TELEGRAM_WEBHOOK_SECRET");
    if (!PAYMENT_PAYLOAD_SECRET) missing.push("PAYMENT_PAYLOAD_SECRET");
    console.error("Webhook env missing:", missing.join(","));
    return res.status(500).json({ error: "Webhook misconfigured" });
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
      console.warn("Rejected successful_payment: invalid payload or charge id");
      return res.status(200).json({ ok: true });
    }

    const product = PRODUCT_CATALOG[parsedPayload.wallpaperId];
    if (!product
      || payment.currency !== "XTR"
      || Number(payment.total_amount) !== product.stars) {
      console.warn("Rejected successful_payment: price/currency mismatch");
      return res.status(200).json({ ok: true });
    }

    const messageFromId = String(update.message?.from?.id || "");
    if (messageFromId !== parsedPayload.userId) {
      console.warn("Rejected successful_payment: user id mismatch");
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
    console.error("Webhook error:", e?.message || "unknown");
    return res.status(200).json({ ok: true });
  }
}
