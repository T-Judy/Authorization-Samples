import jwt from 'jsonwebtoken'
import { getUserById } from '../data/users.js'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

export function jwtAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization: Bearer header' })
  }

  let payload
  try {
    payload = jwt.verify(token, ACCESS_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token expired', code: 'TOKEN_EXPIRED' })
    }
    return res.status(401).json({ error: 'Invalid access token' })
  }

  const user = getUserById(payload.sub)
  if (!user) {
    return res.status(401).json({ error: 'Token subject does not match a known user' })
  }

  req.user = user
  req.token = token
  req.payload = payload
  next()
}
