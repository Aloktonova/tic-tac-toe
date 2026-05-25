/**
 * Admin endpoint to send a test notification
 * Can send to a specific user or to the admin themselves
 */

function isAdminUser(telegramId) {
  // Check if the Telegram ID matches the admin ID
  const adminTelegramId = '1529689011';
  return String(telegramId) === adminTelegramId;
}

async function sendTelegramMessage(botToken, chatId, text) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
        parse_mode: 'HTML'
      })
    }
  );
  return response.ok;
}

async function getUserTelegramId(firebaseDbUrl, userId) {
  try {
    const response = await fetch(
      `${firebaseDbUrl}/users/${userId}/telegramId.json`,
      { method: "GET" }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('[SendTest] Error fetching telegram ID:', e?.message);
  }

  return null;
}

async function logNotification(firebaseDbUrl, uid, telegramId, message, templateUsed, timezone, success, errorMessage) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message,
      templateUsed,
      timezone,
      sentAt: now.getTime(),
      success,
      errorMessage: errorMessage || ''
    };

    await fetch(
      `${firebaseDbUrl}/${logPath}.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry)
      }
    );
  } catch (e) {
    console.error('[SendTest] Error logging notification:', e?.message);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract admin Telegram ID from authorization header only
  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: "Missing BOT_TOKEN or FIREBASE_DATABASE_URL" });
  }

  const { userId, message, templateName } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing required fields: userId, message" });
  }

  try {
    console.log('[SendTest] Sending test notification to user:', userId);

    // Get user's telegram ID
    const telegramId = await getUserTelegramId(firebaseDbUrl, userId);

    if (!telegramId) {
      return res.status(404).json({ error: "User has no telegram ID registered" });
    }

    // Send the message
    const success = await sendTelegramMessage(botToken, telegramId, message);

    if (!success) {
      console.error('[SendTest] Failed to send message to user:', userId);
      await logNotification(
        firebaseDbUrl,
        userId,
        telegramId,
        message,
        templateName || 'test',
        'UTC',
        false,
        'Failed to send via Telegram API'
      );
      return res.status(500).json({ error: "Failed to send notification via Telegram" });
    }

    console.log('[SendTest] Successfully sent to user:', userId);
    await logNotification(
      firebaseDbUrl,
      userId,
      telegramId,
      message,
      templateName || 'test',
      'UTC',
      true,
      ''
    );

    return res.status(200).json({
      ok: true,
      message: "Test notification sent successfully",
      userId,
      telegramId
    });
  } catch (e) {
    console.error('[SendTest] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
