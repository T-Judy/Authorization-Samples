const { findByToken } = require('../data/tokens');
const { getUserById } = require('../data/users');

// Looks up the token in the temp storage
function tokenAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Bearer Authorization header' });
  }

  const row = findByToken(token);
  if (!row) {
    return res.status(401).json({ error: 'Token is invalid or has been revoked' });
  }

  const user = getUserById(row.userId);
  if (!user) {
    return res.status(401).json({ error: 'Token does not map to a known user' });
  }

  req.user = user;
  req.token = token;
  next();
}

module.exports = tokenAuth;
