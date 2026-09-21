import jwt from 'jsonwebtoken';
import { getUserById } from '../data/users.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Re-computes the HMAC signature with jsonwebtoken.verify() -- no database
// lookup at all. If the signature checks out and it hasn't expired, it's
// trusted.
export function jwtAuth(req, res, next) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Bearer auth header' });
  }

  const token = header.slice('Bearer '.length).trim();

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', expired: true });
    }
    return res.status(401).json({ error: 'Invalid access token' });
  }

  if (payload.type === 'refresh') {
    return res.status(401).json({ error: 'Refresh tokens cannot be used to authenticate' });
  }

  const user = getUserById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: 'Unknown user' });
  }

  req.user = user;
  req.token = token;
  req.payload = payload;
  next();
}
