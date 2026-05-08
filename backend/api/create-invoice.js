import crypto from "node:crypto";

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

function buildSignedInvoicePayload({ wallpaperId, userId, secret }) {
  const issuedAtMs = Date.now();
  const nonce = crypto.randomBytes(5).toString("base64url");
  const payloadData =
    "v1|" + wallpaperId + "|" + userId + "|" + issuedAtMs + "|" + nonce;
  const signature = crypto.createHmac("sha256", secret)
    .update(payloadData)
    .digest("base64url")
    .slice(0, 22);
  return "v1:" + wallpaperId + ":" + userId + ":"
    + issuedAtMs + ":" + nonce + ":" + signature;
}

export default async function handler(req, res) {
  const allowedOrigin = process.env.APP_ORIGIN || "";
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
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
    console.error("create-invoice error");
    return res.status(500).json({
      error: e.message || "Internal server error"
    });
  }
}
