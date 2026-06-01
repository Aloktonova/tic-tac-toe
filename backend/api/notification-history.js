/**
 * Get notification broadcast history
 * Shows all broadcasts sent by admin with success/failure counts
 */

function isAdminUser(telegramId) {
  const adminTelegramId = '1529689011';
  return String(telegramId) === adminTelegramId;
}

async function getNotificationHistory(firebaseDbUrl, limit = 50) {
  try {
    const history = [];
    
    // Get last 30 days of logs
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      try {
        const response = await fetch(
          `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
          { method: "GET" }
        );
        
        if (response.ok) {
          const logs = await response.json() || {};
          
          // Group by broadcast (template or admin_broadcast)
          for (const [uid, logEntry] of Object.entries(logs)) {
            if (logEntry && typeof logEntry === 'object') {
              history.push({
                uid,
                dateKey,
                ...logEntry
              });
            }
          }
        }
      } catch (e) {
        console.log(`[NotificationHistory] No logs for date ${dateKey}`);
      }
    }
    
    // Sort by date descending
    history.sort((a, b) => {
      const timeA = a.sentAt || 0;
      const timeB = b.sentAt || 0;
      return timeB - timeA;
    });
    
    // Group by message and aggregate stats
    const broadcasts = {};
    
    for (const entry of history) {
      const key = `${entry.dateKey}-${entry.templateUsed}-${entry.message}`;
      
      if (!broadcasts[key]) {
        broadcasts[key] = {
          dateKey: entry.dateKey,
          sentAt: entry.sentAt,
          templateUsed: entry.templateUsed,
          message: entry.message,
          title: entry.title || entry.message.split('\n')[0],
          totalRecipients: 0,
          successCount: 0,
          failureCount: 0,
          logs: []
        };
      }
      
      broadcasts[key].totalRecipients++;
      if (entry.success) {
        broadcasts[key].successCount++;
      } else {
        broadcasts[key].failureCount++;
      }
      broadcasts[key].logs.push(entry);
    }
    
    // Convert to array and sort
    return Object.values(broadcasts)
      .sort((a, b) => b.sentAt - a.sentAt)
      .slice(0, limit);
  } catch (e) {
    console.error('[NotificationHistory] Error fetching history:', e?.message);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-telegram-id");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Require admin privileges
  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: "Missing FIREBASE_DATABASE_URL" });
  }

  try {
    const limit = parseInt(req.query.limit) || 50;
    const broadcasts = await getNotificationHistory(firebaseDbUrl, limit);

    return res.status(200).json({
      ok: true,
      broadcasts,
      count: broadcasts.length
    });
  } catch (e) {
    console.error('[NotificationHistory] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
