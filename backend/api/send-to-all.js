import { requireAdmin, setAdminCors } from '../lib/admin-auth.js';
import {
  formatBroadcastMessage,
  getAllUsersWithTelegram,
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

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN or FIREBASE_DATABASE_URL' });
  }

  const title = String(req.body?.title || '').trim();
  const message = String(req.body?.message || req.body?.body || '').trim();
  const text = formatBroadcastMessage(title, message);

  if (!text) {
    return res.status(400).json({ error: 'Message body is required' });
  }

  try {
    const players = await getAllUsersWithTelegram(firebaseDbUrl);

    if (!players.length) {
      return res.status(200).json({
        ok: true,
        sent: 0,
        failed: 0,
        total: 0,
        message: 'No registered users with Telegram IDs'
      });
    }

    let sent = 0;
    let failed = 0;
    const BATCH_SIZE = 30;

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (player) => {
        try {
          const ok = await sendTelegramMessage(botToken, player.telegramId, text);
          if (ok) sent++;
          else failed++;
        } catch {
          failed++;
        }
      }));
      if (i + BATCH_SIZE < players.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return res.status(200).json({
      ok: true,
      sent,
      failed,
      total: players.length
    });
  } catch (e) {
    console.error('[SendToAll] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
}
