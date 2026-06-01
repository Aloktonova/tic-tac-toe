/**
 * Admin endpoint to send broadcast notifications with different modes
 * Mode A: "Send To Everyone" - sends to all users regardless of notification settings
 * Mode B: "Daily Scheduled" - sends only to users who have opted in
 */

function isAdminUser(telegramId) {
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
    const telegramIds = [];
    let lastKey = null;
    let hasMore = true;
    let batchCount = 0;
    const maxBatches = 100;

    while (hasMore && batchCount < maxBatches) {
      batchCount++;
      let url = `${firebaseDbUrl}/users.json?limitToFirst=1001`;
      
      if (lastKey) {
        url += `&startAt="${lastKey}"&orderBy="$key"`;
      }

      const response = await fetch(url, { method: "GET" });

      if (response.status === 404) {
        break;
      }

      if (!response.ok) {
        console.error('[AdminBroadcast] Error fetching batch:', response.status);
        break;
      }

      const batch = await response.json() || {};
      const keys = Object.keys(batch);

      if (keys.length === 0) {
        break;
      }

      let itemsInBatch = 0;
      for (const userId of keys) {
        if (lastKey && userId === lastKey && batchCount > 1) {
          continue;
        }

        const user = batch[userId];
        if (user && user.telegramId) {
          telegramIds.push({
            uid: userId,
            telegramId: user.telegramId,
            notificationsEnabled: user.notificationsEnabled !== false
          });
          itemsInBatch++;
        }
      }

      if (keys.length === 1001) {
        lastKey = keys[keys.length - 1];
        hasMore = true;
      } else {
        hasMore = false;
      }

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return telegramIds;
  } catch (e) {
    console.error('[AdminBroadcast] Error fetching player telegram IDs:', e?.message);
    return [];
  }
}

async function logBroadcastNotification(firebaseDbUrl, uid, telegramId, message, title, success, errorMessage) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message,
      title,
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
    console.error('[AdminBroadcast] Error logging notification:', e?.message);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-telegram-id");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require admin privileges
  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: "Missing BOT_TOKEN or FIREBASE_DATABASE_URL" });
  }

  const { message, title, mode } = req.body;

  if (!message || !mode) {
    return res.status(400).json({ error: "Missing required fields: message, mode" });
  }

  if (!['send_to_everyone', 'daily_scheduled'].includes(mode)) {
    return res.status(400).json({ error: "Invalid mode. Must be 'send_to_everyone' or 'daily_scheduled'" });
  }

  try {
    console.log(`[AdminBroadcast] Starting broadcast with mode: ${mode}`);
    const players = await getAllPlayerTelegramIds(firebaseDbUrl);

    if (players.length === 0) {
      return res.status(200).json({
        ok: true,
        message: "No players with telegram IDs found",
        mode,
        sent: 0,
        failed: 0,
        skipped: 0,
        total: 0
      });
    }

    let sent = 0;
    let failed = 0;
    let skipped = 0;

    // Filter players based on mode
    let targetPlayers = players;
    if (mode === 'daily_scheduled') {
      // Only send to users who have notifications enabled
      targetPlayers = players.filter(p => p.notificationsEnabled === true);
      skipped = players.length - targetPlayers.length;
    }

    console.log(`[AdminBroadcast] Mode: ${mode}, Target players: ${targetPlayers.length}, Skipped: ${skipped}`);

    // Send notifications with rate limiting (max 30/second to stay under Telegram limits)
    const BATCH_SIZE = 30;
    const BATCH_DELAY = 1000; // 1 second between batches

    for (let i = 0; i < targetPlayers.length; i += BATCH_SIZE) {
      const batch = targetPlayers.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (player) => {
          try {
            const success = await sendTelegramMessage(botToken, player.telegramId, message);
            if (success) {
              sent++;
              await logBroadcastNotification(
                firebaseDbUrl,
                player.uid,
                player.telegramId,
                message,
                title || 'Admin Broadcast',
                true,
                ''
              );
            } else {
              failed++;
              await logBroadcastNotification(
                firebaseDbUrl,
                player.uid,
                player.telegramId,
                message,
                title || 'Admin Broadcast',
                false,
                'Failed to send via Telegram API'
              );
            }
          } catch (e) {
            failed++;
            await logBroadcastNotification(
              firebaseDbUrl,
              player.uid,
              player.telegramId,
              message,
              title || 'Admin Broadcast',
              false,
              e?.message || 'Unknown error'
            );
          }
        })
      );

      // Wait before next batch
      if (i + BATCH_SIZE < targetPlayers.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log(`[AdminBroadcast] Broadcast complete. Mode: ${mode}, Sent: ${sent}, Failed: ${failed}, Skipped: ${skipped}`);

    return res.status(200).json({
      ok: true,
      message: "Broadcast sent",
      mode,
      sent,
      failed,
      skipped,
      total: targetPlayers.length,
      allUsersCount: players.length
    });
  } catch (e) {
    console.error('[AdminBroadcast] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
