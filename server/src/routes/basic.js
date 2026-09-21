import { Router } from 'express';
import { basicAuth } from '../middleware/basicAuth.js';

const router = Router();

// GET /api/bearer/dashboard
router.get('/dashboard', basicAuth, (req, res) => {
  res.json({
    username: req.user.username,
    credentials: req.credentials.base64,
    decoded: req.credentials.decoded,
  });
});

export default router;
