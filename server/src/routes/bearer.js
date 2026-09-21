import { Router } from 'express';
import { getUserByCredentials } from '../data/users.js';
import { getOrCreateToken, deleteToken } from '../data/tokens.js';
import { tokenAuth } from '../middleware/tokenAuth.js';

const router = Router();


// GET /api/bearer/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = getUserByCredentials(username, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = getOrCreateToken(user.username);
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

export default router;
