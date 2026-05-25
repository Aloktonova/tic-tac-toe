/**
 * Admin endpoint to get notification statistics and debug information
 * Shows: total sent today, failed sends, success rate, recent logs, etc.
 */

function isAdminUser(telegramId) {
  // Check if the Telegram ID matches the admin ID
  const adminTelegramId = '1529689011';
  return String(telegramId) === adminTelegramId;
}

function isValidDateKey(dateKey) {
  // Validate YYYY-MM-DD format
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
}

async function getNotificationStatsForDate(firebaseDbUrl, dateKey) {
  try {
    // Validate dateKey format to prevent path traversal
    if (!isValidDateKey(dateKey)) {
      console.error('[AdminStats] Invalid date key format:', dateKey);
      return null;
    }

    const response = await fetch(
      `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
      { method: "GET" }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { sent: 0, failed: 0, logs: {} };
      }
      return null;
    }

    const logs = await response.json() || {};
    let sent = 0;
    let failed = 0;

    // Iterate through all users' logs for this date
    for (const userId in logs) {
      const userLog = logs[userId];
      if (userLog.success === true) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed, logs };
  } catch (e) {
    console.error('[AdminStats] Error fetching stats:', e?.message || e);
    return null;
  }
}

async function getRecentLogs(firebaseDbUrl, daysBack = 7, limit = 50) {
  try {
    const logs = [];
    const now = new Date();

    // Fetch logs from last N days
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      // Validate dateKey format (should always be valid, but check anyway)
      if (!isValidDateKey(dateKey)) {
        console.error('[AdminStats] Invalid generated date key:', dateKey);
        continue;
      }

      // Fetch all logs for this date (note: limitToFirst doesn't work with nested objects)
      // We'll sort and limit in-memory instead
      const response = await fetch(
        `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
        { method: "GET" }
      );

      if (response.ok) {
        const dateLogs = await response.json() || {};
        for (const userId in dateLogs) {
          logs.push({
            date: dateKey,
            uid: userId,
            ...dateLogs[userId]
          });
        }
      }

      if (logs.length >= limit) {
        break;
      }
    }

    // Sort by sentAt descending and limit
    return logs
      .sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0))
      .slice(0, limit);
  } catch (e) {
    console.error('[AdminStats] Error fetching recent logs:', e?.message || e);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract Telegram ID from authorization header or request body
  const adminTelegramId = req.headers['x-telegram-id'] || req.query.telegramId;
  if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: "Missing FIREBASE_DATABASE_URL" });
  }

  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Fetch today's stats
    const todayStats = await getNotificationStatsForDate(firebaseDbUrl, today);
    if (!todayStats) {
      return res.status(500).json({ error: "Failed to fetch notification stats" });
    }

    // Fetch recent logs (last 7 days)
    const recentLogs = await getRecentLogs(firebaseDbUrl, 7, 50);

    // Calculate success rate
    const total = todayStats.sent + todayStats.failed;
    const successRate = total > 0 ? ((todayStats.sent / total) * 100).toFixed(2) : 0;

    // Get last sent log
    const lastSent = recentLogs.length > 0 ? recentLogs[0] : null;

    // Get template count
    let templateCount = 0;
    try {
      const templatesResponse = await fetch(
        `${firebaseDbUrl}/notifications/templates.json`,
        { method: "GET" }
      );
      if (templatesResponse.ok) {
        const templates = await templatesResponse.json() || {};
        templateCount = Object.keys(templates).length;
      }
    } catch (e) {
      console.error('[AdminStats] Error fetching template count:', e?.message);
    }

    return res.status(200).json({
      ok: true,
      stats: {
        date: today,
        sent: todayStats.sent,
        failed: todayStats.failed,
        total: total,
        successRate: parseFloat(successRate),
        lastSent: lastSent,
        templateCount: templateCount,
        recentLogs: recentLogs.slice(0, 20) // Return top 20 recent logs
      }
    });
  } catch (e) {
    console.error('[AdminStats] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
