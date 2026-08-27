import { Router } from 'express'
import { getUserByCredentials } from '../data/users.js'
import { getOrCreateToken, revokeToken } from '../data/tokens.js'
import { tokenAuth } from '../middleware/tokenAuth.js'

const router = Router()

// POST /api/bearer/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  const user = getUserByCredentials(username, password)
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const token = getOrCreateToken(user.id)

  res.json({
    username: user.username,
    token,
    header: `Bearer ${token}`,
  })
})

// GET /api/bearer/dashboard
router.get('/dashboard', tokenAuth, (req, res) => {
  res.json({
    username: req.user.username,
    token: req.token,
    header: `Bearer ${req.token}`,
  })
})

// POST /api/bearer/logout
router.post('/logout', tokenAuth, (req, res) => {
  revokeToken(req.token)
  res.status(204).end()
})

export default router
