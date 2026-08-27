import { Router } from 'express'
import { getUserByCredentials } from '../data/users.js'
import { basicAuth } from '../middleware/basicAuth.js'

const router = Router()

// POST /api/basic/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  const user = getUserByCredentials(username, password)
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const encoded = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

  res.json({
    username: user.username,
    credentials: encoded,
    decoded: `${username}:${password}`,
  })
})

// GET /api/basic/dashboard
router.get('/dashboard', basicAuth, (req, res) => {
  res.json({
    username: req.user.username,
    credentials: req.basic.encoded,
    decoded: req.basic.decoded,
  })
})

export default router
