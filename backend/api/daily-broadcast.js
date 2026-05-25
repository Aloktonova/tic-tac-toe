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

function isValidUserId(userId) {
  // Firebase UIDs are typically alphanumeric with optional hyphens/underscores
  // Prevent path traversal and special characters
  return typeof userId === "string" && /^[a-zA-Z0-9_\-]+$/.test(userId) && userId.length <= 128;
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

/**
 * Log notification send to Firebase
 * @param {string} firebaseDbUrl - Firebase database URL
 * @param {string} backendUrl - Backend URL for logging
 * @param {string} userId - User ID
 * @param {string} telegramId - Telegram ID
 * @param {string} message - Message sent
 * @param {string} templateUsed - Template name used
 * @param {string} timezone - User's timezone
 * @param {boolean} success - Whether send succeeded
 * @param {string} errorMessage - Error message if failed
 */
async function logNotificationSend(firebaseDbUrl, backendUrl, userId, telegramId, message, templateUsed, timezone, success, errorMessage) {
  try {
    // Try to log via backend endpoint if available
    if (backendUrl) {
      const response = await fetch(`${backendUrl}/api/notifications-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userId,
          telegramId,
          message,
          templateUsed,
          timezone,
          sentAt: Date.now(),
          success,
          errorMessage: errorMessage || ''
        })
      });
      if (!response.ok) {
        console.error('[DailyBroadcast] Backend logging failed, trying direct Firebase write');
      } else {
        return;
      }
    }

    // Fallback to direct Firebase write
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${userId}`;

    await fetch(
      `${firebaseDbUrl}/${logPath}.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userId,
          telegramId,
          message,
          templateUsed,
          timezone,
          sentAt: Date.now(),
          success,
          errorMessage: errorMessage || ''
        })
      }
    );
  } catch (e) {
    console.error('[DailyBroadcast] Error logging notification for', userId, ':', e.message);
  }
}

/**
 * Load notification template from Firebase
 * @param {string} firebaseDbUrl - Firebase database URL
 * @param {string} templateName - Template name (e.g., 'dailyReminder')
 * @returns {Promise<string|null>} Template message text or null
 */
async function loadTemplate(firebaseDbUrl, templateName) {
  try {
    const response = await fetch(
      `${firebaseDbUrl}/notifications/templates/${templateName}.json`,
      { method: "GET" }
    );

    if (!response.ok) {
      console.warn('[DailyBroadcast] Template not found:', templateName);
      return null;
    }

    const template = await response.json();
    if (!template.enabled) {
      console.warn('[DailyBroadcast] Template disabled:', templateName);
      return null;
    }

    // Build message from template fields
    let message = '';
    if (template.title) message += `<b>${template.title}</b>\n\n`;
    if (template.message) message += template.message;
    if (template.buttonText) message += `\n\n🔘 ${template.buttonText}`;

    return message || null;
  } catch (e) {
    console.error('[DailyBroadcast] Error loading template:', templateName, e.message);
    return null;
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
  const backendUrl = process.env.BACKEND_URL;
  
  // Template name to use (will be loaded from Firebase)
  const templateName = process.env.DAILY_TEMPLATE_NAME || 'dailyReminder';
  
  // Fallback message if template loading fails
  const fallbackMessage = process.env.DAILY_TELEGRAM_MESSAGE
    || "🎮 <b>Your Tic Tac Toe Tournament Awaits!</b>\n\n⚔️ Jump back into battle and earn more points to climb the leaderboard!\n\n🏆 Challenge friends and prove your skills: https://t.me/Tictocgame22_bot/app";

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({
      error: "Missing BOT_TOKEN or FIREBASE_DATABASE_URL"
    });
  }

  try {
    console.log('[DailyBroadcast] Starting broadcast at', new Date().toISOString());
    
    // Load template from Firebase
    let messageText = await loadTemplate(firebaseDbUrl, templateName);
    if (!messageText) {
      console.log('[DailyBroadcast] Using fallback message');
      messageText = fallbackMessage;
    } else {
      console.log('[DailyBroadcast] Loaded template:', templateName);
    }
    
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
      // Validate userId to prevent path traversal
      if (!isValidUserId(userId)) {
        console.warn('[DailyBroadcast] Invalid userId format:', userId);
        reasons[userId] = 'invalid_userid_format';
        continue;
      }

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
            console.log('[Notification] Sending to user:', user.userId);
            const ok = await sendTelegramMessage(botToken, user.telegramId, messageText);
            if (ok) {
              // Log successful send
              await logNotificationSend(
                firebaseDbUrl,
                backendUrl,
                user.userId,
                user.telegramId,
                messageText,
                templateName,
                users[user.userId]?.timezone || 'UTC',
                true,
                ''
              );
              // Update timestamp on success
              await updateLastNotificationTimestamp(firebaseDbUrl, user.userId);
              console.log('[Notification] Success for user:', user.userId);
              return true;
            } else {
              // Log failed send
              await logNotificationSend(
                firebaseDbUrl,
                backendUrl,
                user.userId,
                user.telegramId,
                messageText,
                templateName,
                users[user.userId]?.timezone || 'UTC',
                false,
                'Telegram API returned non-ok response'
              );
              console.log('[Notification] Failed for user:', user.userId);
              return false;
            }
          } catch (e) {
            console.error('[DailyBroadcast] Error sending to user', user.userId, ':', e.message);
            // Log error send
            await logNotificationSend(
              firebaseDbUrl,
              backendUrl,
              user.userId,
              user.telegramId,
              messageText,
              templateName,
              users[user.userId]?.timezone || 'UTC',
              false,
              e.message
            );
            console.log('[Notification] Failed with error for user:', user.userId);
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
