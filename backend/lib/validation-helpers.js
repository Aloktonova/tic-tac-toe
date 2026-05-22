// PHASE 5: Backend validation helpers for security

// List of allowed origins for CORS (restrict from wildcard)
const ALLOWED_ORIGINS = [
  'https://aloktonova.github.io',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

// PHASE 5: Helper to set safe CORS headers
function setSafeCorsHeaders(req, res, allowedOrigins = ALLOWED_ORIGINS) {
  const origin = req.headers.origin || '';
  
  // Only set CORS headers if origin is in whitelist
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // If origin is not in whitelist or empty, don't set CORS header at all
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '3600');
}

// PHASE 5: Validate user ID
function validateUserId(userId) {
  if (!userId || typeof userId !== 'string') {
    return false;
  }
  // User IDs should be non-empty strings, alphanumeric + common special chars
  return /^[a-zA-Z0-9:_-]+$/.test(userId) && userId.length <= 100;
}

// PHASE 5: Validate product ID
function validateProductId(productId, allowedProducts) {
  if (!productId || typeof productId !== 'string') {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(allowedProducts, productId);
}

// PHASE 5: Validate email (basic)
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  // Basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// PHASE 5: Safe logging (avoid logging sensitive data)
function logSecurely(event, data) {
  const safeData = { ...data };
  // Remove sensitive fields
  delete safeData.userId;
  delete safeData.userSecret;
  delete safeData.apiKey;
  delete safeData.token;
  
  console.log(`[${event}]`, safeData);
}

export {
  ALLOWED_ORIGINS,
  setSafeCorsHeaders,
  validateUserId,
  validateProductId,
  validateEmail,
  logSecurely
};
