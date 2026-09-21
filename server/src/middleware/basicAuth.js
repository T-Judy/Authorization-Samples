import { getUserByCredentials } from '../data/users.js';

// Decodes the Authorization: Basic <base64> header and re-checks the
// username/password against the user table on EVERY request. There is no
// token or session to reuse -- that's the whole point of the demo.
export function basicAuth(req, res, next) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Missing Basic auth header' });
  }

  const base64Credentials = header.slice('Basic '.length).trim();

  let decoded;
  try {
    decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  } catch {
    return res.status(401).json({ error: 'Malformed credentials' });
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return res.status(401).json({ error: 'Malformed credentials' });
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  const user = getUserByCredentials(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  req.user = user;
  req.credentials = { base64: base64Credentials, decoded };
  next();
}
