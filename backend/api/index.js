const express = require('express');
const crypto = require('crypto');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

function validateTelegramInitData(initData, botToken) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    const checkStr = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    const secret = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    const computed = crypto
      .createHmac('sha256', secret)
      .update(checkStr)
      .digest('hex');
    return computed === hash;
  } catch (e) {
    return false;
  }
}

const app = express();
app.use(express.json());

const TELEGRAM_INIT_DATA_HEADER = 'x-telegram-init-data';
const AI_GENERATE_SECRET_HEADER = 'x-ai-generate-secret';

const firebaseTokenRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' }
});

// From lib/validation-helpers.js
const ALLOWED_ORIGINS = [
  'https://aloktonova.github.io',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

function setSafeCorsHeaders(req, res, allowedOrigins = ALLOWED_ORIGINS) {
  const origin = req.headers.origin || '';

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');
}

function validateUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  return /^[a-zA-Z0-9:_-]+$/.test(userId) && userId.length <= 100;
}

function validateProductId(productId, allowedProducts) {
  if (!productId || typeof productId !== 'string') {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(allowedProducts, productId);
}

function logSecurely(event, data) {
  const safeData = { ...data };
  delete safeData.userId;
  delete safeData.userSecret;
  delete safeData.apiKey;
  delete safeData.token;

  console.log(`[${event}]`, safeData);
}

function getConfiguredAdminTelegramId() {
  return String(process.env.ADMIN_TELEGRAM_ID || '').trim();
}

function parseTelegramUserIdFromInitData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const rawUser = params.get('user');
    if (!rawUser) return null;
    const user = JSON.parse(rawUser);
    const userId = user?.id;
    if (userId == null) return null;
    return String(userId);
  } catch (e) {
    return null;
  }
}

function getVerifiedTelegramUserId(req) {
  const initData = req.headers[TELEGRAM_INIT_DATA_HEADER];
  const botToken = getBotToken();
  if (
    typeof initData !== 'string'
    || !initData
    || !botToken
    || !validateTelegramInitData(initData, botToken)
  ) {
    return null;
  }
  return parseTelegramUserIdFromInitData(initData);
}

function isAdminUserLib(telegramId) {
  const adminTelegramId = getConfiguredAdminTelegramId();
  return !!adminTelegramId && String(telegramId) === adminTelegramId;
}

function requireAdmin(req, res) {
  const verifiedTelegramId = getVerifiedTelegramUserId(req);
  if (!verifiedTelegramId || !isAdminUserLib(verifiedTelegramId)) {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }
  return String(verifiedTelegramId);
}

function setAdminCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', `Content-Type, Authorization, ${TELEGRAM_INIT_DATA_HEADER}`);
}

// From lib/notification-log.js
const AUTO_STATUS_KEYS = {
  daily_challenge: 'lastDailyChallengeSentAt',
  tournament: 'lastTournamentSentAt',
  daily_login: 'lastDailyLoginSentAt'
};

function firebaseBase(url) {
  return String(url || '').replace(/\/$/, '');
}

function computeLogStatus(sent, failed, total) {
  if (total === 0 && failed > 0) return 'Failed';
  if (failed > 0 && sent > 0) return 'Partial';
  if (sent > 0) return 'Success';
  return 'Failed';
}

async function appendRecentLog(firebaseDbUrl, entry) {
  const base = firebaseBase(firebaseDbUrl);
  const sent = entry.successCount ?? 0;
  const failed = entry.failedCount ?? 0;
  const total = entry.recipients ?? sent + failed;

  const logEntry = {
    type: entry.type || 'Manual',
    category: entry.category || 'manual',
    title: String(entry.title || '').slice(0, 120),
    sentAt: entry.sentAt || Date.now(),
    recipients: total,
    successCount: sent,
    failedCount: failed,
    status: entry.status || computeLogStatus(sent, failed, total)
  };

  const response = await fetch(`${base}/notifications/recent.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry)
  });

  if (!response.ok) {
    console.error('[NotificationLog] Failed to append:', response.status);
  }
  return response.ok;
}

async function updateAutoStatus(firebaseDbUrl, category) {
  const key = AUTO_STATUS_KEYS[category];
  if (!key) return false;

  const base = firebaseBase(firebaseDbUrl);
  const response = await fetch(`${base}/notifications/status/${key}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Date.now())
  });
  return response.ok;
}

async function getRecentLogs(firebaseDbUrl, limit = 20) {
  const base = firebaseBase(firebaseDbUrl);
  const response = await fetch(`${base}/notifications/recent.json`, { method: 'GET' });
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(`Failed to load recent logs (${response.status})`);
  }

  const data = await response.json() || {};
  return Object.values(data)
    .filter(Boolean)
    .sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0))
    .slice(0, limit);
}

async function getAutoStatus(firebaseDbUrl) {
  const base = firebaseBase(firebaseDbUrl);
  const response = await fetch(`${base}/notifications/status.json`, { method: 'GET' });
  if (response.status === 404) {
    return {
      lastDailyChallengeSentAt: null,
      lastTournamentSentAt: null,
      lastDailyLoginSentAt: null
    };
  }
  if (!response.ok) {
    throw new Error(`Failed to load auto status (${response.status})`);
  }
  return await response.json() || {};
}

// From lib/telegram-notify.js
async function sendTelegramMessageNotify(botToken, chatId, text) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true
        })
      }
    );

    const data = await response.json().catch(() => ({}));
    if (response.ok && data.ok !== false) {
      return { ok: true };
    }
    return {
      ok: false,
      error: data.description || `Telegram HTTP ${response.status}`
    };
  } catch (e) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}

function formatBroadcastMessage(title, body) {
  const t = String(title || '').trim();
  const b = String(body || '').trim();
  if (t && b) return `${t}\n\n${b}`;
  return t || b;
}

async function getUserTelegramId(firebaseDbUrl, userId) {
  const base = firebaseBase(firebaseDbUrl);
  const response = await fetch(
    `${base}/users/${userId}/telegramId.json`,
    { method: 'GET' }
  );
  if (!response.ok) return null;
  const id = await response.json();
  return id ? String(id) : null;
}

async function getAllUsersWithTelegram(firebaseDbUrl) {
  const base = firebaseBase(firebaseDbUrl);
  const response = await fetch(`${base}/users.json`, { method: 'GET' });

  if (!response.ok) {
    const hint = await response.text().catch(() => '');
    throw new Error(
      `Could not read users from Firebase (${response.status}). ` +
      `Check FIREBASE_DATABASE_URL. ${hint.slice(0, 120)}`
    );
  }

  const users = await response.json();
  if (!users || typeof users !== 'object') {
    return [];
  }

  const players = [];
  for (const [userId, user] of Object.entries(users)) {
    if (user && user.telegramId) {
      players.push({ uid: userId, telegramId: String(user.telegramId) });
    }
  }
  return players;
}

function getBotToken() {
  return process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
}

// From lib/notification-helpers.js
const DEFAULT_TEMPLATES = {
  daily_challenge: {
    displayName: 'Daily Challenge',
    icon: '🎮',
    title: 'Daily Challenge',
    message: '🎮 Daily Challenge is ready! Play now and earn rewards.',
    buttonText: 'Play Now',
    enabled: true,
    createdAt: 0,
    updatedAt: 0
  },
  tournament_reminder: {
    displayName: 'Tournament Reminder',
    icon: '🏆',
    title: 'Tournament Reminder',
    message: '🏆 Tournament is live. Join now and climb the leaderboard.',
    buttonText: 'Join Tournament',
    enabled: true,
    createdAt: 0,
    updatedAt: 0
  },
  come_back: {
    displayName: 'Come Back',
    icon: '🔥',
    title: 'Come Back',
    message: '🔥 Your rivals are playing right now. Come back and defend your rank.',
    buttonText: 'Play Now',
    enabled: true,
    createdAt: 0,
    updatedAt: 0
  }
};

function isValidTemplateId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_]+$/.test(id) && id.length <= 64;
}

function slugifyTemplateId(name) {
  const base = String(name || 'template')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
  return base || 'template';
}

async function fetchTemplates(firebaseDbUrl) {
  const response = await fetch(
    `${firebaseDbUrl}/notifications/templates.json`,
    { method: 'GET' }
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch templates');
  return (await response.json()) || {};
}

async function ensureDefaultTemplates(firebaseDbUrl) {
  const existing = (await fetchTemplates(firebaseDbUrl)) || {};
  const now = Date.now();
  const templates = { ...existing };

  for (const [id, tpl] of Object.entries(DEFAULT_TEMPLATES)) {
    if (templates[id]) continue;
    templates[id] = { ...tpl, createdAt: now, updatedAt: now };
    await fetch(`${firebaseDbUrl}/notifications/templates/${id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templates[id])
    });
  }

  return templates;
}

// From lib/nvidia-ai-client.js
const NVIDIA_API_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = 'qwen/qwen3-coder-480b-a35b-instruct';

function createNvidiaAIClient() {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error(
      'NVIDIA_API_KEY environment variable not configured. ' +
      'Please set it in your Vercel project environment variables.'
    );
  }

  async function chat(messages, options = {}) {
    const {
      temperature = 0.7,
      top_p = 0.8,
      max_tokens = 4096,
      stream = false
    } = options;

    try {
      const response = await fetch(
        `${NVIDIA_API_BASE_URL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: NVIDIA_MODEL,
            messages: messages,
            temperature: temperature,
            top_p: top_p,
            max_tokens: max_tokens,
            stream: stream
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `NVIDIA API error (${response.status}): ` +
          (error.error?.message || error.message || 'Unknown error')
        );
      }

      return await response.json();
    } catch (error) {
      console.error('NVIDIA AI Client error:', error);
      throw error;
    }
  }

  return {
    chat,
    getModel: () => NVIDIA_MODEL,
    getBaseUrl: () => NVIDIA_API_BASE_URL
  };
}

// Route helpers from api files
function isAdminUserLegacy(telegramId) {
  const adminTelegramId = '1529689011';
  return String(telegramId) === adminTelegramId;
}

function isValidDateKey(dateKey) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
}

async function sendTelegramMessageLegacy(botToken, chatId, text) {
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

// /api/admin-send-test
async function getUserTelegramIdAdminSend(firebaseDbUrl, userId) {
  try {
    const response = await fetch(
      `${firebaseDbUrl}/users/${userId}/telegramId.json`,
      { method: 'GET' }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('[SendTest] Error fetching telegram ID:', e?.message);
  }

  return null;
}

async function logNotificationAdminSend(firebaseDbUrl, uid, telegramId, message, templateUsed, timezone, success, errorMessage) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message,
      templateUsed,
      timezone,
      sentAt: now.getTime(),
      success,
      errorMessage: errorMessage || ''
    };

    await fetch(
      `${firebaseDbUrl}/${logPath}.json`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      }
    );
  } catch (e) {
    console.error('[SendTest] Error logging notification:', e?.message);
  }
}

app.all('/api/admin-send-test', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-telegram-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUserLegacy(adminTelegramId)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN or FIREBASE_DATABASE_URL' });
  }

  const { userId, message, templateName } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing required fields: userId, message' });
  }

  try {
    console.log('[SendTest] Sending test notification to user:', userId);

    const telegramId = await getUserTelegramIdAdminSend(firebaseDbUrl, userId);

    if (!telegramId) {
      return res.status(404).json({ error: 'User has no telegram ID registered' });
    }

    const success = await sendTelegramMessageLegacy(botToken, telegramId, message);

    if (!success) {
      console.error('[SendTest] Failed to send message to user:', userId);
      await logNotificationAdminSend(
        firebaseDbUrl,
        userId,
        telegramId,
        message,
        templateName || 'test',
        'UTC',
        false,
        'Failed to send via Telegram API'
      );
      return res.status(500).json({ error: 'Failed to send notification via Telegram' });
    }

    console.log('[SendTest] Successfully sent to user:', userId);
    await logNotificationAdminSend(
      firebaseDbUrl,
      userId,
      telegramId,
      message,
      templateName || 'test',
      'UTC',
      true,
      ''
    );

    return res.status(200).json({
      ok: true,
      message: 'Test notification sent successfully',
      userId,
      telegramId
    });
  } catch (e) {
    console.error('[SendTest] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
});

// /api/admin-stats
async function getNotificationStatsForDate(firebaseDbUrl, dateKey) {
  try {
    if (!isValidDateKey(dateKey)) {
      console.error('[AdminStats] Invalid date key format:', dateKey);
      return null;
    }

    const response = await fetch(
      `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
      { method: 'GET' }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { sent: 0, failed: 0, logs: {} };
      }
      return null;
    }

    const logs = await response.json() || {};
    let sent = 0;
    let failed = 0;

    for (const userId in logs) {
      const userLog = logs[userId];
      if (userLog.success === true) {
        sent++;
      } else {
        failed++;
      }
    }

    return { sent, failed, logs };
  } catch (e) {
    console.error('[AdminStats] Error fetching stats:', e?.message || e);
    return null;
  }
}

async function getRecentLogsAdminStats(firebaseDbUrl, daysBack = 7, limit = 50) {
  try {
    const logs = [];
    const now = new Date();

    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      if (!isValidDateKey(dateKey)) {
        console.error('[AdminStats] Invalid generated date key:', dateKey);
        continue;
      }

      const response = await fetch(
        `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
        { method: 'GET' }
      );

      if (response.ok) {
        const dateLogs = await response.json() || {};
        for (const userId in dateLogs) {
          logs.push({
            date: dateKey,
            uid: userId,
            ...dateLogs[userId]
          });
        }
      }

      if (logs.length >= limit) {
        break;
      }
    }

    return logs
      .sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0))
      .slice(0, limit);
  } catch (e) {
    console.error('[AdminStats] Error fetching recent logs:', e?.message || e);
    return [];
  }
}

app.all('/api/admin-stats', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-telegram-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUserLegacy(adminTelegramId)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const todayStats = await getNotificationStatsForDate(firebaseDbUrl, today);
    if (!todayStats) {
      return res.status(500).json({ error: 'Failed to fetch notification stats' });
    }

    const recentLogs = await getRecentLogsAdminStats(firebaseDbUrl, 7, 50);

    const total = todayStats.sent + todayStats.failed;
    const successRate = total > 0 ? ((todayStats.sent / total) * 100).toFixed(2) : 0;

    const lastSent = recentLogs.length > 0 ? recentLogs[0] : null;

    let templateCount = 0;
    try {
      const templatesResponse = await fetch(
        `${firebaseDbUrl}/notifications/templates.json`,
        { method: 'GET' }
      );
      if (templatesResponse.ok) {
        const templates = await templatesResponse.json() || {};
        templateCount = Object.keys(templates).length;
      }
    } catch (e) {
      console.error('[AdminStats] Error fetching template count:', e?.message);
    }

    return res.status(200).json({
      ok: true,
      stats: {
        date: today,
        sent: todayStats.sent,
        failed: todayStats.failed,
        total: total,
        successRate: parseFloat(successRate),
        lastSent: lastSent,
        templateCount: templateCount,
        recentLogs: recentLogs.slice(0, 20)
      }
    });
  } catch (e) {
    console.error('[AdminStats] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
});

// /api/ai-generate
app.all('/api/ai-generate', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: "Missing or invalid 'message' parameter"
      });
    }

    const client = createNvidiaAIClient();

    const messages = [];

    if (context) {
      messages.push({
        role: 'system',
        content: context
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    const response = await client.chat(messages, {
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 2048
    });

    return res.status(200).json({
      success: true,
      message: response.choices[0]?.message?.content || 'No response',
      model: client.getModel(),
      usage: response.usage
    });

  } catch (error) {
    console.error('AI API error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
});

// /api/check-channel
const JOIN_CHANNEL_REWARD = 50;
const COIN_UPDATE_RETRIES = 3;
const CHANNEL_USERNAME = '@tictactoeclub';

async function addCoinsAtomic(baseUrl, userId, amount) {
  const coinsUrl = `${baseUrl}/users/${userId}/coins.json`;

  for (let i = 0; i < COIN_UPDATE_RETRIES; i++) {
    const coinsRes = await fetch(coinsUrl, {
      headers: {
        'X-Firebase-ETag': 'true'
      }
    });
    const currentCoinsRaw = await coinsRes.json();
    const currentCoins =
      Number.isFinite(Number(currentCoinsRaw))
        ? Number(currentCoinsRaw)
        : 0;
    const etag = coinsRes.headers.get('etag');

    const writeRes = await fetch(coinsUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'If-Match': etag || '*'
      },
      body: JSON.stringify(currentCoins + amount)
    });

    if (writeRes.ok) {
      return;
    }

    if (writeRes.status !== 412) {
      throw new Error('Failed to update coins');
    }
  }

  throw new Error('Coin update conflict');
}

app.all('/api/check-channel', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
  if (!BOT_TOKEN) {
    return res.status(500).json({
      error: 'Bot token not configured'
    });
  }

  try {
    const { userId, telegramId } = req.body;

    if (!userId || !telegramId) {
      return res.status(400).json({
        error: 'Missing userId or telegramId'
      });
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_USERNAME}&user_id=${telegramId}`
    );
    const data = await response.json();

    const status = data?.result?.status;
    const isMember = ['member', 'administrator',
      'creator', 'restricted'].includes(status);

    if (!isMember) {
      return res.status(200).json({
        isMember: false,
        message: 'Please join @tictactoeclub first'
      });
    }

    if (!FIREBASE_DATABASE_URL) {
      return res.status(500).json({
        error: 'Firebase database URL not configured'
      });
    }

    const achievementRes = await fetch(
      `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`
    );
    if (!achievementRes.ok) {
      throw new Error('Failed to read achievement state');
    }
    const achievementData = await achievementRes.json();
    if (achievementData?.claimed) {
      return res.status(200).json({
        isMember: true,
        coinsAwarded: 0,
        alreadyClaimed: true
      });
    }

    const markClaimedRes = await fetch(
      `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimed: true,
          claimedAt: Date.now(),
          pendingReward: true
        })
      }
    );
    if (!markClaimedRes.ok) {
      throw new Error('Failed to mark achievement claimed');
    }

    try {
      await addCoinsAtomic(
        FIREBASE_DATABASE_URL,
        userId,
        JOIN_CHANNEL_REWARD
      );
    } catch (coinError) {
      await fetch(
        `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            claimed: false,
            claimedAt: null,
            pendingReward: false
          })
        }
      );
      throw coinError;
    }

    const finalizeClaimRes = await fetch(
      `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingReward: false
        })
      }
    );
    if (!finalizeClaimRes.ok) {
      throw new Error('Failed to finalize achievement claim');
    }

    return res.status(200).json({
      isMember: true,
      coinsAwarded: JOIN_CHANNEL_REWARD
    });

  } catch (e) {
    console.error('check-channel error:', e);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// /api/create-invoice
const PRODUCTS = {
  galaxy: { name: 'Galaxy', price: 35 },
  sakura: { name: 'Sakura', price: 35 },
  ocean: { name: 'Ocean', price: 35 },
  forest: { name: 'Forest', price: 35 },
  fire: { name: 'Fire', price: 35 },
  aurora: { name: 'Aurora', price: 35 },
  samurai: { name: 'Samurai', price: 35 },
  moonlight: { name: 'Moonlight', price: 35 },
  meadow: { name: 'Meadow', price: 35 },
  castle: { name: 'Dark Castle', price: 35 },
  neon: { name: 'Neon City', price: 35 },
  xp_boost_week: { name: 'XP Boost 7 Days', price: 25 },
  badge_champion: { name: 'Champion Badge', price: 50 },
  animated_marks: { name: 'Animated X & O', price: 75 }
};
const requestLog = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX = 5;

let lastCleanupTime = 0;
function cleanupOldEntries() {
  const now = Date.now();
  if (now - lastCleanupTime < 30000) return;

  for (const [key, times] of requestLog.entries()) {
    const recent = times.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, recent);
    }
  }
  lastCleanupTime = now;
}

app.all('/api/create-invoice', async (req, res) => {
  setSafeCorsHeaders(req, res);

  cleanupOldEntries();

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    logSecurely('create-invoice-error', { reason: 'Bot token not configured' });
    return res.status(500).json({
      error: 'Bot token not configured'
    });
  }

  try {
    const { wallpaperId, userId } = req.body;

    if (!validateProductId(wallpaperId, PRODUCTS)) {
      return res.status(400).json({
        error: 'Invalid product ID'
      });
    }

    if (!validateUserId(userId)) {
      return res.status(400).json({
        error: 'Invalid user ID'
      });
    }

    const product = PRODUCTS[wallpaperId];

    const clientIp = req.headers['x-forwarded-for']
      || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const userKey = userId + '_' + clientIp;
    const userLog = requestLog.get(userKey) || [];
    const recentRequests = userLog.filter(
      t => now - t < RATE_LIMIT_WINDOW_MS
    );

    if (recentRequests.length >= RATE_LIMIT_MAX) {
      logSecurely('create-invoice-rate-limited', { productId: wallpaperId });
      return res.status(429).json({
        error: 'Too many requests. Try again later.'
      });
    }

    recentRequests.push(now);
    requestLog.set(userKey, recentRequests);
    const wallpaperName = product.name;
    const price = product.price;

    if (!Number.isInteger(price) || price <= 0 || price > 10000) {
      logSecurely('create-invoice-error', { reason: 'Invalid price', productId: wallpaperId });
      return res.status(500).json({
        error: 'Invalid product price'
      });
    }

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: wallpaperName + ' Wallpaper',
          description: 'Unlock ' + wallpaperName
            + ' wallpaper permanently in Tic Tac Toe',
          payload: wallpaperId + '_' + userId,
          provider_token: '',
          currency: 'XTR',
          prices: [{
            label: wallpaperName + ' Wallpaper',
            amount: price
          }]
        })
      }
    );

    const data = await telegramRes.json();
    logSecurely('create-invoice-response', { ok: data.ok });

    if (!data.ok) {
      logSecurely('create-invoice-error', { reason: 'Telegram API error', description: data.description });
      return res.status(500).json({
        error: data.description || 'Telegram API error'
      });
    }

    return res.status(200).json({
      invoiceLink: data.result
    });

  } catch (e) {
    logSecurely('create-invoice-error', { reason: e?.message || 'Unknown error' });
    return res.status(500).json({
      error: 'Failed to create invoice'
    });
  }
});

// /api/daily-broadcast
const DAILY_CHALLENGE_MESSAGE = '🎮 Daily Challenge is ready! Play now and earn rewards.';

app.all('/api/daily-broadcast', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const providedAuth = req.headers.authorization || '';
  const expectedSecret = process.env.DAILY_BROADCAST_SECRET;
  const validSecret = expectedSecret && providedAuth === ('Bearer ' + expectedSecret);

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
        const result = await sendTelegramMessageNotify(botToken, player.telegramId, messageText);
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
});

// /api/health
app.all('/api/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now()
  });
});

// /api/notification-admin
app.all('/api/notification-admin', async (req, res) => {
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
});

// /api/notification-history
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

async function sendTelegramMessageHistory(botToken, chatId, text) {
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

app.all('/api/notification-history', async (req, res) => {
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
            const ok = await sendTelegramMessageHistory(botToken, player.telegramId, original.message);
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
});

// /api/notification-templates
function normalizeTemplate(body, existing = null) {
  const now = Date.now();
  return {
    displayName: String(body.displayName || existing?.displayName || 'Untitled').slice(0, 80),
    icon: String(body.icon || existing?.icon || '').slice(0, 8),
    title: String(body.title || existing?.title || '').slice(0, 120),
    message: String(body.message || existing?.message || '').slice(0, 2000),
    buttonText: String(body.buttonText || existing?.buttonText || 'Play Now').slice(0, 40),
    enabled: body.enabled !== undefined ? !!body.enabled : (existing?.enabled !== false),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
}

app.all('/api/notification-templates', async (req, res) => {
  setAdminCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL' });
  }

  try {
    if (req.method === 'GET') {
      const templates = await ensureDefaultTemplates(firebaseDbUrl);
      return res.status(200).json({ ok: true, templates });
    }

    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    if (req.method === 'POST' && req.body?.action === 'init_defaults') {
      const templates = await ensureDefaultTemplates(firebaseDbUrl);
      return res.status(200).json({ ok: true, message: 'Default templates initialized', templates });
    }

    if (req.method === 'POST') {
      const { templateId, displayName, title, message, icon, buttonText, enabled, duplicateFrom } = req.body || {};
      let source = null;
      if (duplicateFrom) {
        if (!isValidTemplateId(duplicateFrom)) {
          return res.status(400).json({ error: 'Invalid duplicateFrom template id' });
        }
        const all = await fetchTemplates(firebaseDbUrl);
        source = all?.[duplicateFrom];
        if (!source) {
          return res.status(404).json({ error: 'Source template not found' });
        }
      }

      let id = templateId ? slugifyTemplateId(templateId) : slugifyTemplateId(displayName || 'template');
      if (!isValidTemplateId(id)) {
        return res.status(400).json({ error: 'Invalid template id' });
      }

      const all = await fetchTemplates(firebaseDbUrl) || {};
      if (all[id] && !duplicateFrom) {
        id = `${id}_${Date.now().toString(36).slice(-4)}`;
      }

      const template = normalizeTemplate(
        {
          displayName: displayName || (source ? `${source.displayName} (Copy)` : 'New Template'),
          title: title || source?.title,
          message: message || source?.message,
          icon: icon ?? source?.icon,
          buttonText: buttonText || source?.buttonText,
          enabled: enabled ?? source?.enabled
        },
        source
      );

      await fetch(`${firebaseDbUrl}/notifications/templates/${id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      return res.status(200).json({ ok: true, templateId: id, template });
    }

    if (req.method === 'PUT') {
      const templateId = req.body?.templateId || req.body?.templateName;
      const { template } = req.body || {};
      if (!templateId || !isValidTemplateId(templateId)) {
        return res.status(400).json({ error: 'Invalid templateId' });
      }
      if (!template || typeof template !== 'object') {
        return res.status(400).json({ error: 'Missing template data' });
      }

      const all = await fetchTemplates(firebaseDbUrl) || {};
      const existing = all[templateId] || null;
      const normalized = normalizeTemplate(template, existing);

      await fetch(`${firebaseDbUrl}/notifications/templates/${templateId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });

      return res.status(200).json({ ok: true, templateId, template: normalized });
    }

    if (req.method === 'DELETE') {
      const templateId = req.query?.templateId || req.query?.templateName
        || req.body?.templateId || req.body?.templateName;
      if (!templateId || !isValidTemplateId(templateId)) {
        return res.status(400).json({ error: 'Invalid templateId' });
      }

      const response = await fetch(
        `${firebaseDbUrl}/notifications/templates/${templateId}.json`,
        { method: 'DELETE' }
      );
      if (!response.ok && response.status !== 404) {
        return res.status(500).json({ error: 'Failed to delete template' });
      }

      return res.status(200).json({ ok: true, templateId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('[Templates] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
});

// /api/notifications-log
app.all('/api/notifications-log', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL' });
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

  if (!uid || !telegramId || !templateUsed) {
    return res.status(400).json({ error: 'Missing required fields: uid, telegramId, templateUsed' });
  }

  try {
    const now = new Date(sentAt || Date.now());
    const dateKey = now.toISOString().split('T')[0];
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

    const response = await fetch(
      `${firebaseDbUrl}/${logPath}.json`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      }
    );

    if (!response.ok) {
      console.error('[NotificationsLog] Failed to write log entry:', response.status, response.statusText);
      return res.status(500).json({ error: 'Failed to write notification log' });
    }

    console.log('[NotificationsLog] Logged notification for', uid, '- success:', success);

    return res.status(200).json({
      ok: true,
      message: 'Notification logged successfully',
      logPath
    });
  } catch (e) {
    console.error('[NotificationsLog] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
});

// /api/retry-failed
const TELEGRAM_API_URL = 'https://api.telegram.org';

async function getFailedNotifications(firebaseDbUrl, dateKey, limit = 50) {
  try {
    if (!isValidDateKey(dateKey)) {
      console.error('[RetryFailed] Invalid date key format:', dateKey);
      return [];
    }

    const response = await fetch(
      `${firebaseDbUrl}/notifications/logs/${dateKey}.json`,
      { method: 'GET' }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      return [];
    }

    const logs = await response.json() || {};
    const failed = [];

    for (const userId in logs) {
      const userLog = logs[userId];
      if (userLog.success === false) {
        failed.push({
          uid: userId,
          ...userLog
        });
      }
    }

    return failed.slice(0, limit);
  } catch (e) {
    console.error('[RetryFailed] Error fetching failed notifications:', e?.message || e);
    return [];
  }
}

async function logNotificationRetry(firebaseDbUrl, uid, telegramId, message, success, errorMessage, retryAttempt) {
  try {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const logPath = `notifications/logs/${dateKey}/${uid}`;

    const logEntry = {
      uid,
      telegramId,
      message,
      templateUsed: 'retry_failed',
      timezone: 'UTC',
      sentAt: now.getTime(),
      success,
      errorMessage: errorMessage || '',
      retryAttempt: retryAttempt
    };

    await fetch(
      `${firebaseDbUrl}/${logPath}.json`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      }
    );
  } catch (e) {
    console.error('[RetryFailed] Error logging retry:', e?.message);
  }
}

app.all('/api/retry-failed', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-telegram-id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUserLegacy(adminTelegramId)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const botToken = process.env.BOT_TOKEN;
  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;

  if (!botToken || !firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing BOT_TOKEN or FIREBASE_DATABASE_URL' });
  }

  const { dateKey, limit = 50, retryAttempt = 1 } = req.body;

  if (!dateKey) {
    return res.status(400).json({ error: 'Missing required field: dateKey (YYYY-MM-DD format)' });
  }

  try {
    console.log('[RetryFailed] Fetching failed notifications for date:', dateKey);
    const failed = await getFailedNotifications(firebaseDbUrl, dateKey, limit);

    if (failed.length === 0) {
      return res.status(200).json({
        ok: true,
        message: 'No failed notifications found for this date',
        retried: 0,
        failed_count: 0
      });
    }

    console.log('[RetryFailed] Found', failed.length, 'failed notifications to retry');

    let retried = 0;
    let retry_failed = 0;

    const BATCH_SIZE = 30;
    const BATCH_DELAY = 1000;

    for (let i = 0; i < failed.length; i += BATCH_SIZE) {
      const batch = failed.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (notification) => {
          try {
            const success = await sendTelegramMessageLegacy(
              botToken,
              notification.telegramId,
              notification.message
            );

            if (success) {
              retried++;
              console.log('[RetryFailed] Successfully retried for', notification.uid);
              await logNotificationRetry(
                firebaseDbUrl,
                notification.uid,
                notification.telegramId,
                notification.message,
                true,
                '',
                retryAttempt
              );
            } else {
              retry_failed++;
              console.error('[RetryFailed] Failed to retry for', notification.uid);
              await logNotificationRetry(
                firebaseDbUrl,
                notification.uid,
                notification.telegramId,
                notification.message,
                false,
                'Failed to send via Telegram API',
                retryAttempt
              );
            }
          } catch (e) {
            retry_failed++;
            console.error('[RetryFailed] Error retrying for', notification.uid, ':', e?.message);
            await logNotificationRetry(
              firebaseDbUrl,
              notification.uid,
              notification.telegramId,
              notification.message,
              false,
              e?.message || 'Unknown error',
              retryAttempt
            );
          }
        })
      );

      if (i + BATCH_SIZE < failed.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log('[RetryFailed] Retry complete. Retried:', retried, 'Failed:', retry_failed);

    return res.status(200).json({
      ok: true,
      message: 'Retry process complete',
      dateKey,
      retried,
      failed_count: retry_failed,
      total_retried: failed.length
    });
  } catch (e) {
    console.error('[RetryFailed] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
});

// /api/send-notification
const AUTO_TYPE_LABELS = {
  daily_login: 'Daily Login',
  daily_challenge: 'Daily Challenge',
  tournament: 'Tournament',
  tournament_join: 'Tournament Join'
};

app.all('/api/send-notification', async (req, res) => {
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
    const isAdmin = isAdminUserLib(requesterTelegramId);

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: 'Not allowed to notify this user' });
    }

    const result = await sendTelegramMessageNotify(botToken, targetTelegramId, text);
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
});

// /api/send-to-all
app.all('/api/send-to-all', async (req, res) => {
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
        const result = await sendTelegramMessageNotify(botToken, player.telegramId, text);
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
});

// /api/webhook
const SECRET_TOKEN_HEADER = 'x-telegram-bot-api-secret-token';

app.post('/api/firebase-token', firebaseTokenRateLimit, async (req, res) => {
  const { initData, telegramUserId } = req.body;
  if (!initData || !telegramUserId) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const valid = validateTelegramInitData(
    initData,
    process.env.BOT_TOKEN
  );
  if (!valid) {
    return res.status(401).json({ error: 'Invalid Telegram data' });
  }
  try {
    const token = await admin.auth()
      .createCustomToken(String(telegramUserId));
    res.json({ token });
  } catch (e) {
    console.error('createCustomToken:', e);
    res.status(500).json({ error: 'Token creation failed' });
  }
});

app.all('/api/webhook', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const secret = req.headers[SECRET_TOKEN_HEADER];
  const expectedSecret = process.env.WEBHOOK_SECRET;
  if (
    !expectedSecret
    || !secret
    || typeof secret !== 'string'
  ) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);
  if (
    secretBuffer.length !== expectedBuffer.length
    || !crypto.timingSafeEqual(
      secretBuffer,
      expectedBuffer
    )
  ) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  if (req.method !== 'POST') {
    return res.status(200).end();
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

  try {
    const update = req.body;
    console.log('Webhook update:',
      JSON.stringify(update));

    if (update.pre_checkout_query) {
      console.log('pre_checkout_query received:',
        update.pre_checkout_query.id);

      const answer = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pre_checkout_query_id:
              update.pre_checkout_query.id,
            ok: true
          })
        }
      );
      const answerData = await answer.json();
      console.log('answerPreCheckoutQuery:',
        answerData);

      return res.status(200).json({ ok: true });
    }

    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment;
      const payload = payment.invoice_payload;
      const chargeId = payment.telegram_payment_charge_id;

      console.log('successful_payment:',
        payload, chargeId);

      const underscoreIndex = payload.indexOf('_');
      const wallpaperId = payload.substring(0, underscoreIndex);
      const userId = payload.substring(underscoreIndex + 1);

      console.log('Unlocking:', wallpaperId,
        'for user:', userId);

      if (FIREBASE_DATABASE_URL
        && wallpaperId && userId) {
        try {
          const WALLPAPER_IDS = ['galaxy', 'sakura', 'ocean',
            'forest', 'fire', 'aurora', 'samurai', 'moonlight',
            'meadow', 'castle', 'neon'];

          if (WALLPAPER_IDS.includes(wallpaperId)) {
            const fbRes = await fetch(
              `${FIREBASE_DATABASE_URL}/users/${userId}/unlockedWallpapers/${wallpaperId}.json`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: 'true'
              }
            );
            console.log('Firebase unlock status:',
              fbRes.status);
          } else {
            await fetch(
              `${FIREBASE_DATABASE_URL}/users/${userId}/ownedItems/${wallpaperId}.json`,
              {
                method: 'PUT',
                body: 'true',
                headers: { 'Content-Type': 'application/json' }
              }
            );

            if (wallpaperId === 'xp_boost_week') {
              const expiry = Date.now()
                + 7 * 24 * 60 * 60 * 1000;
              await fetch(
                `${FIREBASE_DATABASE_URL}/users/${userId}/xpBoostExpiry.json`,
                {
                  method: 'PUT',
                  body: String(expiry),
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
          }

          await fetch(
            `${FIREBASE_DATABASE_URL}/payments/${chargeId}.json`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId,
                wallpaperId,
                amount: payment.total_amount,
                currency: 'XTR',
                timestamp: Date.now(),
                chargeId
              })
            }
          );
        } catch (fbErr) {
          console.error('Firebase error:', fbErr);
        }
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });

  } catch (e) {
    console.error('Webhook error:', e);
    return res.status(200).json({ ok: true });
  }
});

module.exports = app;
