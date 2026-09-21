import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByCredentials, getUserById } from '../data/users.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, username: user.username, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

// GET /api/jwt/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = getUserByCredentials(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  });
});

router.get('/dashboard', jwtAuth, (req, res) => {
  res.json({
    username: req.user.username,
    accessToken: req.token,
    header: `Bearer ${req.token}`,
    payload: req.payload,
    iat: req.payload.iat,
    exp: req.payload.exp,
  });
});

// POST /api/jwt/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  if (payload.type !== 'refresh') {
    return res.status(401).json({ error: 'That is not a refresh token' });
  }

  const user = getUserById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: 'Unknown user' });
  }

  res.json({ accessToken: signAccessToken(user) });
});

// POST /api/jwt/logout
router.post('/logout', (req, res) => {
  res.json({ ok: true });
});

export default router;
