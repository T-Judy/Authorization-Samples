const crypto = require('crypto');

// In-memory "token table", keyed by token value. One row per issued token.
const tokensByValue = new Map(); // token -> { userId, username, createdAt }
const tokenByUserId = new Map(); // userId -> token 

function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

// get_or_create: reuse an existing token for the user if one exists, otherwise mint one.
function getOrCreateToken(user) {
  const existing = tokenByUserId.get(user.id);
  if (existing && tokensByValue.has(existing)) {
    return existing;
  }
  const token = generateToken();
  tokensByValue.set(token, { userId: user.id, username: user.username, createdAt: Date.now() });
  tokenByUserId.set(user.id, token);
  return token;
}

function findByToken(token) {
  return tokensByValue.get(token) || null;
}

function deleteToken(token) {
  const row = tokensByValue.get(token);
  if (row) {
    tokenByUserId.delete(row.userId);
  }
  tokensByValue.delete(token);
}

module.exports = { getOrCreateToken, findByToken, deleteToken };
