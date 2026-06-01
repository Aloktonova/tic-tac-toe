import { requireAdmin, setAdminCors } from '../lib/admin-auth.js';
import { getAutoStatus, getRecentLogs } from '../lib/notification-log.js';
import { getAllUsersWithTelegram, getBotToken } from '../lib/telegram-notify.js';

export default async function handler(req, res) {
  setAdminCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL' });
  }

  try {
    const limit = Math.min(parseInt(req.query?.limit || '20', 10), 50);
    const recent = await getRecentLogs(firebaseDbUrl, limit);
    const autoStatus = await getAutoStatus(firebaseDbUrl);

    let recipientCount = null;
    try {
      const players = await getAllUsersWithTelegram(firebaseDbUrl);
      recipientCount = players.length;
    } catch (e) {
      recipientCount = null;
    }

    return res.status(200).json({
      ok: true,
      recent,
      autoStatus,
      config: {
        hasBotToken: !!getBotToken(),
        hasFirebase: !!firebaseDbUrl,
        registeredTelegramUsers: recipientCount
      }
    });
  } catch (e) {
    console.error('[NotificationAdmin] Error:', e?.message || e);
    return res.status(500).json({ error: e?.message || 'Failed to load admin notification data' });
  }
}
