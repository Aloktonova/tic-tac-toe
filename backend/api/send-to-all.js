import { requireAdmin, setAdminCors } from '../lib/admin-auth.js';
import {
  appendRecentLog,
  computeLogStatus,
  updateAutoStatus
} from '../lib/notification-log.js';
import {
  formatBroadcastMessage,
  getAllUsersWithTelegram,
  getBotToken,
  sendTelegramMessage
} from '../lib/telegram-notify.js';

export default async function handler(req, res) {
  setAdminCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  const botToken = getBotToken();
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;

  if (!botToken) {
    return res.status(500).json({
      error: 'Missing BOT_TOKEN (or TELEGRAM_BOT_TOKEN) in Vercel environment variables'
    });
  }
  if (!firebaseDbUrl) {
    return res.status(500).json({
      error: 'Missing FIREBASE_DATABASE_URL in Vercel environment variables'
    });
  }

  const title = String(req.body?.title || '').trim();
  const message = String(req.body?.message || req.body?.body || '').trim();
  const logCategory = String(req.body?.logCategory || 'manual').trim();
  const text = formatBroadcastMessage(title, message);

  if (!text) {
    return res.status(400).json({ error: 'Message body is required' });
  }

  try {
    const players = await getAllUsersWithTelegram(firebaseDbUrl);

    if (!players.length) {
      await appendRecentLog(firebaseDbUrl, {
        type: logCategory === 'manual' ? 'Manual' : 'Auto',
        category: logCategory,
        title: title || message.slice(0, 80),
        recipients: 0,
        successCount: 0,
        failedCount: 0,
        status: 'Failed'
      });

      return res.status(200).json({
        ok: true,
        sent: 0,
        failed: 0,
        total: 0,
        warning: 'No users with telegramId found in Firebase users/'
      });
    }

    let sent = 0;
    let failed = 0;
    let lastError = '';
    const BATCH_SIZE = 30;

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (player) => {
        const result = await sendTelegramMessage(botToken, player.telegramId, text);
        if (result.ok) {
          sent++;
        } else {
          failed++;
          if (result.error) lastError = result.error;
        }
      }));
      if (i + BATCH_SIZE < players.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    const status = computeLogStatus(sent, failed, players.length);

    await appendRecentLog(firebaseDbUrl, {
      type: logCategory === 'manual' ? 'Manual' : 'Auto',
      category: logCategory,
      title: title || message.slice(0, 80),
      recipients: players.length,
      successCount: sent,
      failedCount: failed,
      status
    });

    if (logCategory === 'tournament') {
      await updateAutoStatus(firebaseDbUrl, 'tournament');
    }

    return res.status(200).json({
      ok: true,
      sent,
      failed,
      total: players.length,
      status,
      lastError: failed > 0 ? lastError : undefined
    });
  } catch (e) {
    console.error('[SendToAll] Error:', e?.message || e);
    return res.status(500).json({
      error: e?.message || 'Internal server error'
    });
  }
}
