const jwt = require('jsonwebtoken');
const { getUserById } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET;

function jwtAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Bearer Authorization header' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'access') {
      return res.status(401).json({ error: 'Token is not an access token' });
    }

    const user = getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Token does not map to a known user' });
    }

    // Token maps to a user
    req.user = user;
    req.accessToken = token;
    req.tokenPayload = payload;
    next();
  } catch (err) {
    // Token is old
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token has expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid access token' });
  }
}

module.exports = jwtAuth;
