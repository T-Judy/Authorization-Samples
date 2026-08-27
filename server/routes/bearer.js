const express = require('express');
const { getUserByCredentials } = require('../data/users');
const { getOrCreateToken, deleteToken } = require('../data/tokens');
const tokenAuth = require('../middleware/tokenAuth');

const router = express.Router();

// POST /api/bearer/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = getUserByCredentials(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = getOrCreateToken(user);
  res.json({ username: user.username, token });
});

// GET /api/bearer/dashboard
router.get('/dashboard', tokenAuth, (req, res) => {
  res.json({
    username: req.user.username,
    token: req.token,
    header: `Bearer ${req.token}`,
  });
});

// POST /api/bearer/logout
router.post('/logout', tokenAuth, (req, res) => {
  deleteToken(req.token);
  res.json({ ok: true });
});

module.exports = router;
