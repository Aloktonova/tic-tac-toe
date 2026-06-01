import { isAdminUser } from '../lib/admin-auth.js';
import {
  appendRecentLog,
  updateAutoStatus
} from '../lib/notification-log.js';
import {
  getBotToken,
  getUserTelegramId,
  sendTelegramMessage
} from '../lib/telegram-notify.js';

const AUTO_TYPE_LABELS = {
  daily_login: 'Daily Login',
  daily_challenge: 'Daily Challenge',
  tournament: 'Tournament',
  tournament_join: 'Tournament Join'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-telegram-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const botToken = getBotToken();
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  const requesterTelegramId = req.headers['x-telegram-id'];

  if (!botToken) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN in server config' });
  }
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL in server config' });
  }
  if (!requesterTelegramId) {
    return res.status(401).json({ error: 'Missing x-telegram-id header (open app in Telegram)' });
  }

  const { userId, message, autoType } = req.body || {};
  const text = String(message || '').trim();
  const category = String(autoType || 'auto').trim();

  if (!userId || !text) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }

  try {
    const targetTelegramId = await getUserTelegramId(firebaseDbUrl, userId);
    if (!targetTelegramId) {
      return res.status(404).json({
        error: 'User has no telegramId in Firebase (users/' + userId + '/telegramId)'
      });
    }

    const isSelf = String(requesterTelegramId) === String(targetTelegramId);
    const isAdmin = isAdminUser(requesterTelegramId);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: 'Not allowed to notify this user' });
    }

    const result = await sendTelegramMessage(botToken, targetTelegramId, text);
    if (!result.ok) {
      await appendRecentLog(firebaseDbUrl, {
        type: 'Auto',
        category,
        title: AUTO_TYPE_LABELS[category] || text.slice(0, 80),
        recipients: 1,
        successCount: 0,
        failedCount: 1,
        status: 'Failed'
      });
      return res.status(500).json({
        error: result.error || 'Failed to send via Telegram'
      });
    }

    await appendRecentLog(firebaseDbUrl, {
      type: 'Auto',
      category,
      title: AUTO_TYPE_LABELS[category] || text.slice(0, 80),
      recipients: 1,
      successCount: 1,
      failedCount: 0,
      status: 'Success'
    });

    if (category === 'daily_login') {
      await updateAutoStatus(firebaseDbUrl, 'daily_login');
    } else if (category === 'daily_challenge') {
      await updateAutoStatus(firebaseDbUrl, 'daily_challenge');
    } else if (category === 'tournament' || category === 'tournament_join') {
      if (category === 'tournament') {
        await updateAutoStatus(firebaseDbUrl, 'tournament');
      }
    }

    return res.status(200).json({ ok: true, userId, telegramId: targetTelegramId });
  } catch (e) {
    console.error('[SendNotification] Error:', e?.message || e);
    return res.status(500).json({ error: e?.message || 'Internal server error' });
  }
}
