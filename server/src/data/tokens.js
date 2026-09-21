import crypto from 'crypto';

// In-memory "token table": token string -> username.
// One row per logged-in user, exactly like the diagram in the dashboard says.
const tokens = new Map();

function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

// get_or_create: reuse an existing token for this user instead of minting a
// new one on every login, so logging in twice doesn't orphan old tokens.
export function getOrCreateToken(username) {
  for (const [token, uname] of tokens.entries()) {
    if (uname === username) return token;
  }
  const token = generateToken();
  tokens.set(token, username);
  return token;
}

export function getUsernameByToken(token) {
  return tokens.get(token) || null;
}

export function deleteToken(token) {
  return tokens.delete(token);
}
