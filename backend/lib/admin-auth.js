export const ADMIN_TELEGRAM_ID = '1529689011';

export function isAdminUser(telegramId) {
  return String(telegramId) === ADMIN_TELEGRAM_ID;
}

export function requireAdmin(req, res) {
  const adminTelegramId = req.headers['x-telegram-id'];
  if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }
  return String(adminTelegramId);
}

export function setAdminCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-telegram-id');
}
