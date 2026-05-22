const TELEGRAM_API_URL = "https://api.telegram.org";
const MAX_MESSAGES_PER_SECOND = 30;
const SAFE_BATCH_SIZE = 29;
const NOTIFICATION_HOUR = 10; // 10 AM

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isNumericId(value) {
  return typeof value === "string" && /^[0-9]+$/.test(value);
}

/**
 * Get current hour in user's timezone
 * @param {string} timezoneStr - Timezone string like 'America/New_York' or null
 * @returns {number} Current hour (0-23) in user's timezone
 */
function getCurrentHourInTimezone(timezoneStr) {
  try {
    // If no timezone provided, use UTC
    if (!timezoneStr) return new Date().getUTCHours();
    
    // Create a formatter for the timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneStr,
      hour: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find(p => p.type === 'hour');
    return parseInt(hourPart?.value || '0', 10);
  } catch (e) {
    console.error('[DailyBroadcast] Error parsing timezone', timezoneStr, ':', e.message);
    // Fall back to UTC on error
    return new Date().getUTCHours();
  }
}

/**
 * Check if a user should receive notification today
 * @param {Object} user - User object
 * @returns {boolean} True if user should receive notification
 */
function shouldSendNotification(user) {
  // Check if notifications are enabled (default to true if not set)
  if (user.notificationsEnabled === false) return false;
  
  // Check if user has played at least 1 game
  const hasPlayed = (user.wins || 0) + (user.losses || 0) + (user.draws || 0) > 0;
  if (!hasPlayed) return false;
  
  // Check if user is banned
  if (user.isBanned === true) return false;
  
  // Check if it's 10 AM in user's timezone
  const currentHour = getCurrentHourInTimezone(user.timezone);
  if (currentHour !== NOTIFICATION_HOUR) return false;
  
  // Check if already notified today
  if (user.lastNotificationTimestamp) {
    const lastNotifDate = new Date(user.lastNotificationTimestamp);
    const todayDate = new Date();
    
    // If last notification was today, don't send again
    if (lastNotifDate.toDateString() === todayDate.toDateString()) {
      return false;
    }
  }
  
  return true;
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

/**
 * Update user's last notification timestamp in Firebase
 * @param {string} firebaseDbUrl - Firebase database URL
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if update succeeded
 */
async function updateLastNotificationTimestamp(firebaseDbUrl, userId) {
  try {
    const response = await fetch(
      `${firebaseDbUrl}/users/${userId}/lastNotificationTimestamp.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Date.now())
      }
    );
    return response.ok;
  } catch (e) {
    console.error('[DailyBroadcast] Error updating notification timestamp for', userId, ':', e.message);
    return false;
  }
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
  
  // Allow customization of message, with fallback to default
  const messageText = process.env.DAILY_TELEGRAM_MESSAGE
    || "🎮 <b>Your Tic Tac Toe Tournament Awaits!</b>\n\n⚔️ Jump back into battle and earn more points to climb the leaderboard!\n\n🏆 Challenge friends and prove your skills: https://t.me/Tictocgame22_bot/app";

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({
      error: "Missing BOT_TOKEN or FIREBASE_DATABASE_URL"
    });
  }

  try {
    console.log('[DailyBroadcast] Starting broadcast at', new Date().toISOString());
    
    const usersRes = await fetch(`${firebaseDbUrl}/users.json`);
    if (!usersRes.ok) {
      console.error('[DailyBroadcast] Failed to fetch users:', usersRes.status);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    const users = await usersRes.json() || {};

    const userIds = Object.keys(users);
    console.log('[DailyBroadcast] Processing', userIds.length, 'users');
    
    const eligible = [];
    const reasons = {}; // Track why users are ineligible
    
    // Filter users who should receive notification
    for (const userId of userIds) {
      const user = users[userId] || {};
      const telegramId = user?.telegramId;
      
      if (!telegramId || !isNumericId(String(telegramId))) {
        reasons[userId] = 'no_valid_telegram_id';
        continue;
      }
      
      if (!shouldSendNotification(user)) {
        // Determine reason for logging
        if (user.notificationsEnabled === false) {
          reasons[userId] = 'notifications_disabled';
        } else if (!((user.wins || 0) + (user.losses || 0) + (user.draws || 0) > 0)) {
          reasons[userId] = 'no_games_played';
        } else if (user.isBanned === true) {
          reasons[userId] = 'banned';
        } else {
          const currentHour = getCurrentHourInTimezone(user.timezone);
          reasons[userId] = `wrong_hour (${currentHour}:00 vs ${NOTIFICATION_HOUR}:00)`;
        }
        continue;
      }
      
      eligible.push({ userId, telegramId: String(telegramId) });
    }
    
    console.log('[DailyBroadcast] Eligible for notification:', eligible.length);
    console.log('[DailyBroadcast] Ineligible breakdown:', reasons);

    if (!eligible.length) {
      return res.status(200).json({
        ok: true,
        sent: 0,
        failed: 0,
        total: userIds.length,
        eligible: 0,
        message: "No users eligible for notification"
      });
    }

    let sent = 0;
    let failed = 0;
    
    // Send notifications in batches
    for (let i = 0; i < eligible.length; i += SAFE_BATCH_SIZE) {
      const batch = eligible.slice(i, i + SAFE_BATCH_SIZE);
      console.log('[DailyBroadcast] Processing batch', Math.floor(i / SAFE_BATCH_SIZE) + 1, 'with', batch.length, 'users');
      
      const results = await Promise.all(
        batch.map(async (user) => {
          try {
            const ok = await sendTelegramMessage(botToken, user.telegramId, messageText);
            if (ok) {
              // Update timestamp on success
              await updateLastNotificationTimestamp(firebaseDbUrl, user.userId);
              return true;
            }
            return false;
          } catch (e) {
            console.error('[DailyBroadcast] Error sending to user', user.userId, ':', e.message);
            return false;
          }
        })
      );
      
      results.forEach(ok => {
        if (ok) sent += 1;
        else failed += 1;
      });
      
      // Throttle between batches
      if (i + SAFE_BATCH_SIZE < eligible.length) {
        await sleep(1000);
      }
    }

    console.log('[DailyBroadcast] Broadcast complete:', { sent, failed, total: eligible.length });
    
    return res.status(200).json({
      ok: true,
      sent,
      failed,
      total: userIds.length,
      eligible: eligible.length,
      message: `Sent to ${sent} users, ${failed} failed`
    });
  } catch (e) {
    console.error("daily-broadcast error:", e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
