import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { getUserByCredentials, getUserById } from '../data/users.js'
import { jwtAuth } from '../middleware/jwtAuth.js'

const router = Router()

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  })
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  })
}

// POST /api/jwt/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  const user = getUserByCredentials(username, password)
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)

  res.json({
    username: user.username,
    accessToken,
    refreshToken,
    header: `Bearer ${accessToken}`,
  })
})

// POST /api/jwt/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body || {}

  if (!refreshToken) {
    return res.status(400).json({ error: 'refreshToken is required' })
  }

  let payload
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired, please log in again' })
    }
    return res.status(401).json({ error: 'Invalid refresh token' })
  }

  if (payload.type !== 'refresh') {
    return res.status(401).json({ error: 'Token is not a refresh token' })
  }

  const user = getUserById(payload.sub)
  if (!user) {
    return res.status(401).json({ error: 'Refresh token subject does not match a known user' })
  }

  const accessToken = signAccessToken(user)

  res.json({
    username: user.username,
    accessToken,
    header: `Bearer ${accessToken}`,
  })
})

// GET /api/jwt/dashboard
router.get('/dashboard', jwtAuth, (req, res) => {
  res.json({
    username: req.user.username,
    accessToken: req.token,
    header: `Bearer ${req.token}`,
    payload: req.payload,
    iat: req.payload.iat,
    exp: req.payload.exp,
  })
})

// POST /api/jwt/logout
router.post('/logout', (req, res) => {
  res.status(204).end()
})

export default router
