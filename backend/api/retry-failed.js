/**
 * Retry endpoint to re-queue failed notifications
 * Fetches failed notifications from logs and re-sends them
 * Only accessible by the admin Telegram ID (1529689011)
 */

const TELEGRAM_API_URL = "https://api.telegram.org";

function isAdminUser(telegramId) {
  // Check if the Telegram ID matches the admin ID
  const adminTelegramId = '1529689011';
  return String(telegramId) === adminTelegramId;
}

function isValidDateKey(dateKey) {
  // Validate YYYY-MM-DD format
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
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
        disable_web_page_preview: true,
        parse_mode: 'HTML'
      })
    }
  );
  return response.ok;
}

async function getFailedNotifications(firebaseDbUrl, dateKey, limit = 50) {
  try {
    // Validate dateKey format to prevent path traversal
    if (!isValidDateKey(dateKey)) {
      console.error('[RetryFailed] Invalid date key format:', dateKey);
      return [];
    }

    const response = await fetch(
      `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
      { method: "GET" }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      return [];
    }

    const logs = await response.json() || {};
    const failed = [];

    // Collect all failed notifications for this date
    for (const userId in logs) {
      const userLog = logs[userId];
      if (userLog.success === false) {
        failed.push({
          uid: userId,
          ...userLog
        });
      }
    }

    return failed.slice(0, limit);
  } catch (e) {
    console.error('[RetryFailed] Error fetching failed notifications:', e?.message || e);
    return [];
  }
}

async function logNotificationRetry(firebaseDbUrl, uid, telegramId, message, success, errorMessage, retryAttempt) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message,
      templateUsed: 'retry_failed',
      timezone: 'UTC',
      sentAt: now.getTime(),
      success,
      errorMessage: errorMessage || '',
      retryAttempt: retryAttempt
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
    console.error('[RetryFailed] Error logging retry:', e?.message);
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

  const { dateKey, limit = 50, retryAttempt = 1 } = req.body;

  if (!dateKey) {
    return res.status(400).json({ error: "Missing required field: dateKey (YYYY-MM-DD format)" });
  }

  try {
    console.log('[RetryFailed] Fetching failed notifications for date:', dateKey);
    const failed = await getFailedNotifications(firebaseDbUrl, dateKey, limit);

    if (failed.length === 0) {
      return res.status(200).json({
        ok: true,
        message: "No failed notifications found for this date",
        retried: 0,
        failed_count: 0
      });
    }

    console.log('[RetryFailed] Found', failed.length, 'failed notifications to retry');

    let retried = 0;
    let retry_failed = 0;

    // Retry sending with rate limiting (max 30/second to stay under Telegram limits)
    const BATCH_SIZE = 30;
    const BATCH_DELAY = 1000; // 1 second between batches

    for (let i = 0; i < failed.length; i += BATCH_SIZE) {
      const batch = failed.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (notification) => {
          try {
            const success = await sendTelegramMessage(
              botToken,
              notification.telegramId,
              notification.message
            );

            if (success) {
              retried++;
              console.log('[RetryFailed] Successfully retried for', notification.uid);
              await logNotificationRetry(
                firebaseDbUrl,
                notification.uid,
                notification.telegramId,
                notification.message,
                true,
                '',
                retryAttempt
              );
            } else {
              retry_failed++;
              console.error('[RetryFailed] Failed to retry for', notification.uid);
              await logNotificationRetry(
                firebaseDbUrl,
                notification.uid,
                notification.telegramId,
                notification.message,
                false,
                'Failed to send via Telegram API',
                retryAttempt
              );
            }
          } catch (e) {
            retry_failed++;
            console.error('[RetryFailed] Error retrying for', notification.uid, ':', e?.message);
            await logNotificationRetry(
              firebaseDbUrl,
              notification.uid,
              notification.telegramId,
              notification.message,
              false,
              e?.message || 'Unknown error',
              retryAttempt
            );
          }
        })
      );

      // Wait before next batch
      if (i + BATCH_SIZE < failed.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log('[RetryFailed] Retry complete. Retried:', retried, 'Failed:', retry_failed);

    return res.status(200).json({
      ok: true,
      message: "Retry process complete",
      dateKey,
      retried,
      failed_count: retry_failed,
      total_retried: failed.length
    });
  } catch (e) {
    console.error('[RetryFailed] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
