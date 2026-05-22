/**
 * Logs notification sends to Firebase for admin debugging and analytics
 * Called by daily-broadcast.js after each send attempt
 */

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

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: "Missing FIREBASE_DATABASE_URL" });
  }

  const {
    uid,
    telegramId,
    message,
    templateUsed,
    timezone,
    sentAt,
    success,
    errorMessage
  } = req.body;

  // Validate required fields
  if (!uid || !telegramId || !templateUsed) {
    return res.status(400).json({ error: "Missing required fields: uid, telegramId, templateUsed" });
  }

  try {
    // Create log entry at notifications/logs/{date}/{uid}
    const now = new Date(sentAt || Date.now());
    const dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message: message || '',
      templateUsed,
      timezone: timezone || 'UTC',
      sentAt: sentAt || Date.now(),
      success: success === true,
      errorMessage: errorMessage || ''
    };

    // Write to Firebase
    const response = await fetch(
      `${firebaseDbUrl}/${logPath}.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry)
      }
    );

    if (!response.ok) {
      console.error('[NotificationsLog] Failed to write log entry:', response.status, response.statusText);
      return res.status(500).json({ error: "Failed to write notification log" });
    }

    console.log('[NotificationsLog] Logged notification for', uid, '- success:', success);

    return res.status(200).json({
      ok: true,
      message: "Notification logged successfully",
      logPath
    });
  } catch (e) {
    console.error('[NotificationsLog] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
