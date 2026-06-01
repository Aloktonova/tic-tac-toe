import { requireAdmin, setAdminCors } from '../lib/admin-auth.js';
async function fetchBroadcasts(firebaseDbUrl, limit = 50) {
  const response = await fetch(
    `${firebaseDbUrl}/notifications/broadcasts.json?orderBy="$key"&limitToLast=${limit}`,
    { method: 'GET' }
  );
  if (response.status === 404) return [];
  if (!response.ok) throw new Error('Failed to fetch broadcast history');
  const data = await response.json() || {};
  return Object.entries(data)
    .map(([id, row]) => ({ id, ...row }))
    .sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0));
}

async function sendTelegramMessage(botToken, chatId, text) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
        parse_mode: 'HTML'
      })
    }
  );
  return response.ok;
}

async function getAllPlayerTelegramIds(firebaseDbUrl, mode) {
  const players = [];
  let lastKey = null;
  let batchCount = 0;

  while (batchCount < 100) {
    batchCount++;
    let url = `${firebaseDbUrl}/users.json?limitToFirst=1001`;
    if (lastKey) {
      url += `&startAt="${lastKey}"&orderBy="$key"`;
    }

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) break;

    const batch = await response.json() || {};
    const keys = Object.keys(batch);
    if (keys.length === 0) break;

    for (const userId of keys) {
      if (lastKey && userId === lastKey && batchCount > 1) continue;
      const user = batch[userId];
      if (!user?.telegramId) continue;
      if (mode === 'opt_in' && user.notificationsEnabled === false) continue;
      players.push({ uid: userId, telegramId: String(user.telegramId) });
    }

    if (keys.length === 1001) {
      lastKey = keys[keys.length - 1];
      await new Promise(r => setTimeout(r, 100));
    } else {
      break;
    }
  }

  return players;
}

export default async function handler(req, res) {
  setAdminCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  const botToken = process.env.BOT_TOKEN;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL' });
  }

  try {
    if (req.method === 'GET') {
      const limit = Math.min(parseInt(req.query?.limit || '50', 10), 100);
      const history = await fetchBroadcasts(firebaseDbUrl, limit);
      return res.status(200).json({ ok: true, history });
    }

    if (req.method === 'POST') {
      if (!botToken) {
        return res.status(500).json({ error: 'Missing BOT_TOKEN' });
      }

      const { broadcastId } = req.body || {};
      if (!broadcastId) {
        return res.status(400).json({ error: 'Missing broadcastId' });
      }

      const snap = await fetch(
        `${firebaseDbUrl}/notifications/broadcasts/${broadcastId}.json`,
        { method: 'GET' }
      );
      if (!snap.ok) {
        return res.status(404).json({ error: 'Broadcast not found' });
      }
      const original = await snap.json();
      if (!original?.message) {
        return res.status(400).json({ error: 'Broadcast has no message' });
      }

      const mode = original.mode || 'everyone';
      const players = await getAllPlayerTelegramIds(firebaseDbUrl, mode);
      let sent = 0;
      let failed = 0;
      const BATCH_SIZE = 30;

      for (let i = 0; i < players.length; i += BATCH_SIZE) {
        const batch = players.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (player) => {
          try {
            const ok = await sendTelegramMessage(botToken, player.telegramId, original.message);
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

      const resentId = `broadcast_${Date.now()}_resend`;
      const record = {
        id: resentId,
        title: original.title || '',
        message: original.message,
        templateId: original.templateId || '',
        mode,
        sentAt: Date.now(),
        totalRecipients: players.length,
        successCount: sent,
        failedCount: failed,
        sentBy: adminId,
        resentFrom: broadcastId
      };

      await fetch(`${firebaseDbUrl}/notifications/broadcasts/${resentId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });

      return res.status(200).json({
        ok: true,
        broadcastId: resentId,
        sent,
        failed,
        total: players.length
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('[NotificationHistory] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
}
