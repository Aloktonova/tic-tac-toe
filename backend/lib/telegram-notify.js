export async function sendTelegramMessage(botToken, chatId, text) {
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
  return response.ok;
}

export function formatBroadcastMessage(title, body) {
  const t = String(title || '').trim();
  const b = String(body || '').trim();
  if (t && b) return `${t}\n\n${b}`;
  return t || b;
}

export async function getUserTelegramId(firebaseDbUrl, userId) {
  const response = await fetch(
    `${firebaseDbUrl}/users/${userId}/telegramId.json`,
    { method: 'GET' }
  );
  if (!response.ok) return null;
  const id = await response.json();
  return id ? String(id) : null;
}

export async function getAllUsersWithTelegram(firebaseDbUrl) {
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
    if (!keys.length) break;

    for (const userId of keys) {
      if (lastKey && userId === lastKey && batchCount > 1) continue;
      const user = batch[userId];
      if (user?.telegramId) {
        players.push({ uid: userId, telegramId: String(user.telegramId) });
      }
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
