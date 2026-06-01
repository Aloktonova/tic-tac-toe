/**
 * Daily cron: sends "Daily Challenge is ready" to all registered Telegram users.
 */
import {
  appendRecentLog,
  computeLogStatus,
  updateAutoStatus
} from '../lib/notification-log.js';
import {
  getAllUsersWithTelegram,
  getBotToken,
  sendTelegramMessage
} from '../lib/telegram-notify.js';

const DAILY_CHALLENGE_MESSAGE =
  '🎮 Daily Challenge is ready! Play now and earn rewards.';

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

  const botToken = getBotToken();
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  const messageText = process.env.DAILY_TELEGRAM_MESSAGE || DAILY_CHALLENGE_MESSAGE;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN or FIREBASE_DATABASE_URL' });
  }

  try {
    const players = await getAllUsersWithTelegram(firebaseDbUrl);

    if (!players.length) {
      return res.status(200).json({ ok: true, sent: 0, failed: 0, total: 0 });
    }

    let sent = 0;
    let failed = 0;
    const BATCH_SIZE = 30;

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (player) => {
        const result = await sendTelegramMessage(botToken, player.telegramId, messageText);
        if (result.ok) sent++;
        else failed++;
      }));
      if (i + BATCH_SIZE < players.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    const status = computeLogStatus(sent, failed, players.length);

    await appendRecentLog(firebaseDbUrl, {
      type: 'Auto',
      category: 'daily_challenge',
      title: 'Daily Challenge',
      recipients: players.length,
      successCount: sent,
      failedCount: failed,
      status
    });
    await updateAutoStatus(firebaseDbUrl, 'daily_challenge');

    return res.status(200).json({
      ok: true,
      sent,
      failed,
      total: players.length,
      status
    });
  } catch (e) {
    console.error('[DailyBroadcast] Error:', e?.message || e);
    return res.status(500).json({ error: e?.message || 'Internal server error' });
  }
}
