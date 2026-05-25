/**
 * Admin endpoint to send notifications to all players
 * Only accessible by the admin Telegram ID (1529689011)
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

async function getAllPlayerTelegramIds(firebaseDbUrl) {
  try {
    const response = await fetch(
      `${firebaseDbUrl}/users.json?orderBy="telegramId"&limitToFirst=1000`,
      { method: "GET" }
    );

    if (!response.ok) {
      return [];
    }

    const users = await response.json() || {};
    const telegramIds = [];

    for (const userId in users) {
      const user = users[userId];
      if (user.telegramId) {
        telegramIds.push({
          uid: userId,
          telegramId: user.telegramId
        });
      }
    }

    return telegramIds;
  } catch (e) {
    console.error('[SendToAll] Error fetching player telegram IDs:', e?.message);
    return [];
  }
}

async function logBroadcastNotification(firebaseDbUrl, uid, telegramId, message, success, errorMessage) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message,
      templateUsed: 'admin_broadcast',
      timezone: 'UTC',
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
    console.error('[SendToAll] Error logging notification:', e?.message);
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

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing required field: message" });
  }

  try {
    console.log('[SendToAll] Fetching all player telegram IDs...');
    const players = await getAllPlayerTelegramIds(firebaseDbUrl);

    if (players.length === 0) {
      return res.status(200).json({
        ok: true,
        message: "No players with telegram IDs found",
        sent: 0,
        failed: 0
      });
    }

    console.log('[SendToAll] Sending to', players.length, 'players');

    let sent = 0;
    let failed = 0;

    // Send notifications with rate limiting (max 30/second to stay under Telegram limits)
    const BATCH_SIZE = 30;
    const BATCH_DELAY = 1000; // 1 second between batches

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (player) => {
          try {
            const success = await sendTelegramMessage(botToken, player.telegramId, message);
            if (success) {
              sent++;
              console.log('[SendToAll] Sent to', player.uid);
              await logBroadcastNotification(
                firebaseDbUrl,
                player.uid,
                player.telegramId,
                message,
                true,
                ''
              );
            } else {
              failed++;
              console.error('[SendToAll] Failed to send to', player.uid);
              await logBroadcastNotification(
                firebaseDbUrl,
                player.uid,
                player.telegramId,
                message,
                false,
                'Failed to send via Telegram API'
              );
            }
          } catch (e) {
            failed++;
            console.error('[SendToAll] Error sending to', player.uid, ':', e?.message);
            await logBroadcastNotification(
              firebaseDbUrl,
              player.uid,
              player.telegramId,
              message,
              false,
              e?.message || 'Unknown error'
            );
          }
        })
      );

      // Wait before next batch
      if (i + BATCH_SIZE < players.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log('[SendToAll] Broadcast complete. Sent:', sent, 'Failed:', failed);

    return res.status(200).json({
      ok: true,
      message: "Broadcast sent",
      sent,
      failed,
      total: players.length
    });
  } catch (e) {
    console.error('[SendToAll] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
