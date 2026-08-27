const express = require('express');
const { getUserByCredentials } = require('../data/users');
const basicAuth = require('../middleware/basicAuth');

const router = express.Router();

// POST /api/basic/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = getUserByCredentials(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.json({ username: user.username });
});

// GET /api/basic/dashboard
router.get('/dashboard', basicAuth, (req, res) => {
  res.json({
    username: req.user.username,
    credentials: req.basicCredentialsEncoded,
    decoded: req.basicCredentialsDecoded,
  });
});

module.exports = router;
