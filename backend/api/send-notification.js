import { isAdminUser } from '../lib/admin-auth.js';
import {
  getUserTelegramId,
  sendTelegramMessage
} from '../lib/telegram-notify.js';

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

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  const requesterTelegramId = req.headers['x-telegram-id'];

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN or FIREBASE_DATABASE_URL' });
  }

  if (!requesterTelegramId) {
    return res.status(401).json({ error: 'Missing x-telegram-id header' });
  }

  const { userId, message } = req.body || {};
  const text = String(message || '').trim();

  if (!userId || !text) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }

  try {
    const targetTelegramId = await getUserTelegramId(firebaseDbUrl, userId);
    if (!targetTelegramId) {
      return res.status(404).json({ error: 'User has no Telegram ID' });
    }

    const isSelf = String(requesterTelegramId) === String(targetTelegramId);
    const isAdmin = isAdminUser(requesterTelegramId);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: 'Not allowed to notify this user' });
    }

    const ok = await sendTelegramMessage(botToken, targetTelegramId, text);
    if (!ok) {
      return res.status(500).json({ error: 'Failed to send via Telegram' });
    }

    return res.status(200).json({ ok: true, userId, telegramId: targetTelegramId });
  } catch (e) {
    console.error('[SendNotification] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
}
