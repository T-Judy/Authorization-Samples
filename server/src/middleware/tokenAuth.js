import { getUserById } from '../data/users.js'
import { getUserIdByToken } from '../data/tokens.js'

export function tokenAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization: Bearer header' })
  }

  const userId = getUserIdByToken(token)
  if (userId === null) {
    return res.status(401).json({ error: 'Token not recognized or has been revoked' })
  }

  const user = getUserById(userId)
  if (!user) {
    return res.status(401).json({ error: 'Token does not map to a known user' })
  }

  req.user = user
  req.token = token
  next()
}
