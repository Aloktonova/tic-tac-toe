export const AUTO_STATUS_KEYS = {
  daily_challenge: 'lastDailyChallengeSentAt',
  tournament: 'lastTournamentSentAt',
  daily_login: 'lastDailyLoginSentAt'
};

function firebaseBase(url) {
  return String(url || '').replace(/\/$/, '');
}

export function computeLogStatus(sent, failed, total) {
  if (total === 0 && failed > 0) return 'Failed';
  if (failed > 0 && sent > 0) return 'Partial';
  if (sent > 0) return 'Success';
  return 'Failed';
}

export async function appendRecentLog(firebaseDbUrl, entry) {
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

export async function updateAutoStatus(firebaseDbUrl, category) {
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

export async function getRecentLogs(firebaseDbUrl, limit = 20) {
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

export async function getAutoStatus(firebaseDbUrl) {
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
