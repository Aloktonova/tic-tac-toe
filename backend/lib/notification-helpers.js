export const DEFAULT_TEMPLATES = {
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

export function isValidTemplateId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_]+$/.test(id) && id.length <= 64;
}

export function slugifyTemplateId(name) {
  const base = String(name || 'template')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 48);
  return base || 'template';
}

export function formatTemplateMessage(template) {
  const icon = template.icon ? `${template.icon} ` : '';
  const title = template.title || template.displayName || 'Notification';
  const body = template.message || '';
  return `${icon}<b>${title}</b>\n\n${body}`.trim();
}

export async function fetchTemplates(firebaseDbUrl) {
  const response = await fetch(
    `${firebaseDbUrl}/notifications/templates.json`,
    { method: 'GET' }
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch templates');
  return (await response.json()) || {};
}

export async function ensureDefaultTemplates(firebaseDbUrl) {
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

export async function saveBroadcastRecord(firebaseDbUrl, record) {
  const id = record.id || `broadcast_${Date.now()}`;
  const path = `notifications/broadcasts/${id}`;
  await fetch(`${firebaseDbUrl}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...record, id })
  });
  return id;
}
