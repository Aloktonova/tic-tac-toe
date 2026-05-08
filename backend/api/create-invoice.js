import crypto from "node:crypto";
import { PRODUCT_CATALOG } from "./_product-catalog.js";

const NONCE_SIZE_BYTES = 10;
const SIGNATURE_LENGTH = 22;

function isValidTelegramUserId(userId) {
  return typeof userId === "string" && /^[0-9]{1,20}$/.test(userId);
}

function buildSignedInvoicePayload({ wallpaperId, userId, secret }) {
  const issuedAtMs = Date.now();
  const nonce = crypto.randomBytes(NONCE_SIZE_BYTES).toString("base64url");
  const payloadData =
    "v1|" + wallpaperId + "|" + userId + "|" + issuedAtMs + "|" + nonce;
  const signature = crypto.createHmac("sha256", secret)
    .update(payloadData)
    .digest("base64url")
    .slice(0, SIGNATURE_LENGTH);
  return "v1:" + wallpaperId + ":" + userId + ":"
    + issuedAtMs + ":" + nonce + ":" + signature;
}

export default async function handler(req, res) {
  const allowedOrigin = process.env.APP_ORIGIN;
  if (!allowedOrigin) {
    return res.status(500).json({
      error: "APP_ORIGIN not configured"
    });
  }
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const PAYMENT_PAYLOAD_SECRET = process.env.PAYMENT_PAYLOAD_SECRET;
  if (!BOT_TOKEN) {
    return res.status(500).json({
      error: "Bot token not configured"
    });
  }
  if (!PAYMENT_PAYLOAD_SECRET) {
    return res.status(500).json({
      error: "Payment payload secret not configured"
    });
  }

  try {
    const body = req.body || {};
    const wallpaperId = typeof body.wallpaperId === "string"
      ? body.wallpaperId.trim()
      : "";
    const userId = typeof body.userId === "string"
      ? body.userId.trim()
      : "";
    const item = PRODUCT_CATALOG[wallpaperId];

    if (!item || !isValidTelegramUserId(userId)) {
      return res.status(400).json({
        error: "Invalid purchase request"
      });
    }

    const payload = buildSignedInvoicePayload({
      wallpaperId: item.id,
      userId,
      secret: PAYMENT_PAYLOAD_SECRET
    });

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: item.name + " Wallpaper",
          description: "Unlock " + item.name
            + " wallpaper permanently in Tic Tac Toe",
          payload,
          provider_token: "",
          currency: "XTR",
          prices: [{
            label: item.name + " Wallpaper",
            amount: item.stars
          }]
        })
      }
    );

    const data = await telegramRes.json();

    if (!data.ok) {
      return res.status(500).json({
        error: data.description || "Telegram API error"
      });
    }

    return res.status(200).json({
      invoiceLink: data.result
    });

  } catch(e) {
    console.error("create-invoice error:", e?.message || "unknown");
    return res.status(500).json({
      error: e.message || "Internal server error"
    });
  }
}
