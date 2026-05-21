const TELEGRAM_API_URL = "https://api.telegram.org";
const MAX_MESSAGES_PER_SECOND = 30;
const SAFE_BATCH_SIZE = 29;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isNumericId(value) {
  return typeof value === "string" && /^[0-9]+$/.test(value);
}

async function sendTelegramMessage(botToken, chatId, text) {
  const response = await fetch(
    `${TELEGRAM_API_URL}/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true
      })
    }
  );
  return response.ok;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isVercelCron = req.headers["x-vercel-cron"] === "1";
  const providedAuth = req.headers.authorization || "";
  const expectedSecret = process.env.DAILY_BROADCAST_SECRET;
  const validSecret = expectedSecret
    && providedAuth === `Bearer ${expectedSecret}`;
  if (!isVercelCron && !validSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  const messageText = process.env.DAILY_TELEGRAM_MESSAGE
    || "🎮 Play Tic Tac Toe now! Challenge friends and climb the leaderboard: https://t.me/Tictocgame22_bot/app";

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({
      error: "Missing BOT_TOKEN or FIREBASE_DATABASE_URL"
    });
  }

  try {
    const usersRes = await fetch(`${firebaseDbUrl}/users.json`);
    if (!usersRes.ok) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    const users = await usersRes.json() || {};

    const idSet = new Set();
    Object.values(users).forEach(user => {
      const telegramId = user?.telegramId;
      if (telegramId && isNumericId(String(telegramId))) {
        idSet.add(String(telegramId));
      }
    });

    const telegramIds = [...idSet];
    if (!telegramIds.length) {
      return res.status(200).json({
        ok: true,
        sent: 0,
        failed: 0,
        total: 0,
        maxMessagesPerSecond: MAX_MESSAGES_PER_SECOND
      });
    }

    let sent = 0;
    let failed = 0;
    for (let i = 0; i < telegramIds.length; i += SAFE_BATCH_SIZE) {
      const batch = telegramIds.slice(i, i + SAFE_BATCH_SIZE);
      const results = await Promise.all(
        batch.map(chatId => sendTelegramMessage(botToken, chatId, messageText))
      );
      results.forEach(ok => {
        if (ok) sent += 1;
        else failed += 1;
      });
      if (i + SAFE_BATCH_SIZE < telegramIds.length) {
        await sleep(1000);
      }
    }

    return res.status(200).json({
      ok: true,
      sent,
      failed,
      total: telegramIds.length,
      maxMessagesPerSecond: MAX_MESSAGES_PER_SECOND
    });
  } catch (e) {
    console.error("daily-broadcast error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
