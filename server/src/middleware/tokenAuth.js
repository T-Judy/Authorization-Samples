import { getUsernameByToken } from '../data/tokens.js';
import { getUserByUsername } from '../data/users.js';

// Looks the opaque token up in the in-memory token table. One lookup per
// request, but the raw credentials are never sent again after login.
export function tokenAuth(req, res, next) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Bearer auth header' });
  }

  const token = header.slice('Bearer '.length).trim();
  const username = getUsernameByToken(token);

  if (!username) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user = getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  req.token = token;
  next();
}
