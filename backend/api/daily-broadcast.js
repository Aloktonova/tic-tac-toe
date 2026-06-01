/**
 * Daily cron: sends "Daily Challenge is ready" to all registered Telegram users.
 */
import { getAllUsersWithTelegram, sendTelegramMessage } from '../lib/telegram-notify.js';

const DAILY_CHALLENGE_MESSAGE =
  '🎮 Daily Challenge is ready! Play now and earn rewards.';

function isNumericId(value) {
  return typeof value === 'string' && /^[0-9]+$/.test(value);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const providedAuth = req.headers.authorization || '';
  const expectedSecret = process.env.DAILY_BROADCAST_SECRET;
  const validSecret = expectedSecret && providedAuth === `Bearer ${expectedSecret}`;

  if (!isVercelCron && !validSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  const messageText = process.env.DAILY_TELEGRAM_MESSAGE || DAILY_CHALLENGE_MESSAGE;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN or FIREBASE_DATABASE_URL' });
  }

  try {
    const players = await getAllUsersWithTelegram(firebaseDbUrl);
    const eligible = players.filter(p => isNumericId(p.telegramId));

    if (!eligible.length) {
      return res.status(200).json({ ok: true, sent: 0, failed: 0, total: 0 });
    }

    let sent = 0;
    let failed = 0;
    const BATCH_SIZE = 30;

    for (let i = 0; i < eligible.length; i += BATCH_SIZE) {
      const batch = eligible.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (player) => {
        try {
          const ok = await sendTelegramMessage(botToken, player.telegramId, messageText);
          if (ok) sent++;
          else failed++;
        } catch {
          failed++;
        }
      }));
      if (i + BATCH_SIZE < eligible.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    return res.status(200).json({
      ok: true,
      sent,
      failed,
      total: eligible.length
    });
  } catch (e) {
    console.error('[DailyBroadcast] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
}
