export function firebaseBase(url) {
  return String(url || '').replace(/\/$/, '');
}

export async function sendTelegramMessage(botToken, chatId, text) {
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

export function formatBroadcastMessage(title, body) {
  const t = String(title || '').trim();
  const b = String(body || '').trim();
  if (t && b) return `${t}\n\n${b}`;
  return t || b;
}

export async function getUserTelegramId(firebaseDbUrl, userId) {
  const base = firebaseBase(firebaseDbUrl);
  const response = await fetch(
    `${base}/users/${userId}/telegramId.json`,
    { method: 'GET' }
  );
  if (!response.ok) return null;
  const id = await response.json();
  return id ? String(id) : null;
}

/** Fetch all users with a Telegram ID (single request — reliable for typical DB sizes). */
export async function getAllUsersWithTelegram(firebaseDbUrl) {
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

export function getBotToken() {
  return process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
}
