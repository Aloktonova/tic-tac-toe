import { requireAdmin, setAdminCors } from '../lib/admin-auth.js';
import {
  fetchTemplates,
  formatTemplateMessage,
  saveBroadcastRecord
} from '../lib/notification-helpers.js';

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
  const telegramIds = [];
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
      telegramIds.push({ uid: userId, telegramId: String(user.telegramId) });
    }

    if (keys.length === 1001) {
      lastKey = keys[keys.length - 1];
      await new Promise(r => setTimeout(r, 100));
    } else {
      break;
    }
  }

  return telegramIds;
}

async function logPerUserSend(firebaseDbUrl, uid, telegramId, message, templateUsed, success, errorMessage, broadcastId) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}_${broadcastId || 'broadcast'}`;

    await fetch(`${firebaseDbUrl}/${logPath}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        telegramId,
        message,
        title: '',
        templateUsed,
        broadcastId: broadcastId || '',
        timezone: 'UTC',
        sentAt: now.getTime(),
        success,
        errorMessage: errorMessage || ''
      })
    });
  } catch (e) {
    console.error('[SendToAll] Error logging notification:', e?.message);
  }
}

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

  const {
    message,
    title,
    templateId,
    mode = 'everyone'
  } = req.body || {};

  const sendMode = mode === 'opt_in' ? 'opt_in' : 'everyone';

  let finalMessage = typeof message === 'string' ? message.trim() : '';
  let finalTitle = typeof title === 'string' ? title.trim() : '';
  let templateUsed = templateId || 'admin_broadcast';

  if (templateId) {
    const templates = await fetchTemplates(firebaseDbUrl);
    const tpl = templates?.[templateId];
    if (!tpl) {
      return res.status(404).json({ error: 'Template not found' });
    }
    finalMessage = formatTemplateMessage(tpl);
    finalTitle = tpl.title || tpl.displayName || '';
    templateUsed = templateId;
  }

  if (!finalMessage) {
    return res.status(400).json({ error: 'Missing required field: message or templateId' });
  }

  try {
    const players = await getAllPlayerTelegramIds(firebaseDbUrl, sendMode);

    if (players.length === 0) {
      const emptyRecord = {
        id: `broadcast_${Date.now()}`,
        title: finalTitle,
        message: finalMessage,
        templateId: templateUsed,
        mode: sendMode,
        sentAt: Date.now(),
        totalRecipients: 0,
        successCount: 0,
        failedCount: 0,
        sentBy: adminId
      };
      await saveBroadcastRecord(firebaseDbUrl, emptyRecord);
      return res.status(200).json({
        ok: true,
        message: 'No eligible players found',
        broadcastId: emptyRecord.id,
        sent: 0,
        failed: 0,
        total: 0
      });
    }

    const broadcastId = `broadcast_${Date.now()}`;
    let sent = 0;
    let failed = 0;
    const BATCH_SIZE = 30;
    const BATCH_DELAY = 1000;

    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (player) => {
        try {
          const success = await sendTelegramMessage(botToken, player.telegramId, finalMessage);
          if (success) {
            sent++;
            await logPerUserSend(
              firebaseDbUrl, player.uid, player.telegramId,
              finalMessage, templateUsed, true, '', broadcastId
            );
          } else {
            failed++;
            await logPerUserSend(
              firebaseDbUrl, player.uid, player.telegramId,
              finalMessage, templateUsed, false, 'Telegram API error', broadcastId
            );
          }
        } catch (e) {
          failed++;
          await logPerUserSend(
            firebaseDbUrl, player.uid, player.telegramId,
            finalMessage, templateUsed, false, e?.message || 'Unknown error', broadcastId
          );
        }
      }));

      if (i + BATCH_SIZE < players.length) {
        await new Promise(r => setTimeout(r, BATCH_DELAY));
      }
    }

    await saveBroadcastRecord(firebaseDbUrl, {
      id: broadcastId,
      title: finalTitle,
      message: finalMessage,
      templateId: templateUsed,
      mode: sendMode,
      sentAt: Date.now(),
      totalRecipients: players.length,
      successCount: sent,
      failedCount: failed,
      sentBy: adminId
    });

    return res.status(200).json({
      ok: true,
      message: 'Broadcast sent',
      broadcastId,
      title: finalTitle,
      sent,
      failed,
      total: players.length,
      mode: sendMode
    });
  } catch (e) {
    console.error('[SendToAll] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
}
