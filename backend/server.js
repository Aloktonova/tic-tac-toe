/**
 * Telegram Stars invoice backend for Tic Tac Toe Mini App
 *
 * Run:
 *   TELEGRAM_BOT_TOKEN=123:ABC node backend/server.js
 *
 * Optional:
 *   PORT=3000
 *   TELEGRAM_API_BASE=https://api.telegram.org
 */

const http = require('http');

const PORT = Number(process.env.PORT || 3000);
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_API_BASE = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';
const MAX_REQUEST_BODY_SIZE = 1024 * 64;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Missing TELEGRAM_BOT_TOKEN');
  process.exit(1);
}

const ALLOWED_ITEM_TYPES = new Set(['wallpaper', 'coins', 'theme', 'premium_effect']);

// Server-side catalog: pricing/title/description source of truth.
const ITEM_CATALOG = {
  wallpaper: {
    galaxy: { title: 'Galaxy Wallpaper', description: 'Unlock Galaxy wallpaper for your game.', stars: 35 },
    sakura: { title: 'Sakura Wallpaper', description: 'Unlock Sakura wallpaper for your game.', stars: 35 },
    aurora: { title: 'Aurora Wallpaper', description: 'Unlock Aurora wallpaper for your game.', stars: 35 },
    ocean: { title: 'Ocean Wallpaper', description: 'Unlock Ocean wallpaper for your game.', stars: 35 },
    forest: { title: 'Forest Wallpaper', description: 'Unlock Forest wallpaper for your game.', stars: 35 },
    fire: { title: 'Fire Wallpaper', description: 'Unlock Fire wallpaper for your game.', stars: 35 },
    samurai: { title: 'Samurai Wallpaper', description: 'Unlock Samurai wallpaper for your game.', stars: 35 },
    moonlight: { title: 'Moonlight Wallpaper', description: 'Unlock Moonlight wallpaper for your game.', stars: 35 },
    meadow: { title: 'Meadow Wallpaper', description: 'Unlock Meadow wallpaper for your game.', stars: 35 },
    castle: { title: 'Dark Castle Wallpaper', description: 'Unlock Dark Castle wallpaper for your game.', stars: 35 },
    neon: { title: 'Neon City Wallpaper', description: 'Unlock Neon City wallpaper for your game.', stars: 35 }
  },
  coins: {},
  theme: {},
  premium_effect: {}
};

function sendJson(res, code, payload) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function buildPayload({ telegramUserId, itemType, itemId }) {
  // Deterministic payload helps avoid accidental duplicate purchases for same user/item.
  return `purchase:${itemType}:${itemId}:uid:${telegramUserId}`;
}

function sanitizeString(v, max = 120) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function resolveItem(input) {
  const itemType = sanitizeString(input.itemType || 'wallpaper', 40);
  const itemId = sanitizeString(input.wallpaperId || input.itemId, 80);
  const starsAmount = Number(input.starsAmount);
  const telegramUserId = sanitizeString(String(input.telegramUserId || ''), 40);

  if (!telegramUserId || !/^\d+$/.test(telegramUserId)) {
    return { error: 'Invalid telegramUserId' };
  }
  if (!ALLOWED_ITEM_TYPES.has(itemType)) {
    return { error: 'Invalid itemType' };
  }
  if (!itemId) {
    return { error: 'Missing item id' };
  }

  const catalogItem = ITEM_CATALOG[itemType]?.[itemId];
  if (!catalogItem) {
    return { error: 'Unknown item' };
  }

  // Prevent client price tampering: require exact match with catalog.
  if (!Number.isFinite(starsAmount) || starsAmount !== catalogItem.stars) {
    return { error: 'Invalid starsAmount' };
  }

  return {
    telegramUserId,
    itemType,
    itemId,
    starsAmount: catalogItem.stars,
    title: catalogItem.title,
    description: catalogItem.description
  };
}

async function createTelegramInvoiceLink(item) {
  const url = `${TELEGRAM_API_BASE}/bot${TELEGRAM_BOT_TOKEN}/createInvoiceLink`;
  const payload = buildPayload(item);

  // Telegram Stars invoice: currency XTR, no provider token.
  const body = {
    title: item.title,
    description: item.description,
    payload,
    currency: 'XTR',
    prices: [{ label: item.title, amount: item.starsAmount }]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Telegram API HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok || typeof data?.result !== 'string') {
    throw new Error(`Telegram API error: ${data?.description || 'unknown'}`);
  }

  return data.result;
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  if (req.method !== 'POST' || req.url !== '/api/telegram/stars/invoice') {
    return sendJson(res, 404, { error: 'Not found' });
  }

  let raw = '';
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > MAX_REQUEST_BODY_SIZE) {
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      const parsed = JSON.parse(raw || '{}');
      const item = resolveItem(parsed);
      if (item.error) {
        return sendJson(res, 400, { error: item.error });
      }

      const invoiceUrl = await createTelegramInvoiceLink(item);
      return sendJson(res, 200, { invoiceUrl });
    } catch (err) {
      console.error('Invoice endpoint error:', err);
      return sendJson(res, 500, { error: 'Failed to create invoice link' });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Telegram Stars backend listening on :${PORT}`);
});
