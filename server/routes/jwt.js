const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserByCredentials, getUserById } = require('../data/users');
const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Bootleg blacklist
const revokedRefreshTokens = new Set();

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, username: user.username, type: 'access' }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

// POST /api/jwt/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = getUserByCredentials(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  res.json({ username: user.username, accessToken, refreshToken });
});

// GET /api/jwt/dashboard
router.get('/dashboard', jwtAuth, (req, res) => {
  res.json({
    username: req.user.username,
    accessToken: req.accessToken,
    header: `Bearer ${req.accessToken}`,
    payload: req.tokenPayload,
    iat: req.tokenPayload.iat,
    exp: req.tokenPayload.exp,
  });
});

// POST /api/jwt/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' });
  }

  if (revokedRefreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: 'Refresh token has been revoked' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Token is not a refresh token' });
    }

    const user = getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Refresh token does not map to a known user' });
    }

    // Rotate the refresh token: revoke the old one, issue a new pair
    revokedRefreshTokens.add(refreshToken);
    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    res.json({ username: user.username, accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token has expired', code: 'REFRESH_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/jwt/logout
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body || {};
  if (refreshToken) {
    revokedRefreshTokens.add(refreshToken);
  }
  res.json({ ok: true });
});

module.exports = router;
