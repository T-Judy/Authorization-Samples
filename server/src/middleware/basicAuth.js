import { getUserByCredentials } from '../data/users.js'

export function basicAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, encoded] = header.split(' ')

  if (scheme !== 'Basic' || !encoded) {
    res.set('WWW-Authenticate', 'Basic realm="auth-demo"')
    return res.status(401).json({ error: 'Missing or malformed Authorization: Basic header' })
  }

  let decoded
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8')
  } catch {
    return res.status(400).json({ error: 'Authorization header is not valid base64' })
  }

  const separatorIndex = decoded.indexOf(':')
  if (separatorIndex === -1) {
    return res.status(400).json({ error: 'Decoded credentials must be in username:password form' })
  }

  const username = decoded.slice(0, separatorIndex)
  const password = decoded.slice(separatorIndex + 1)

  const user = getUserByCredentials(username, password)
  if (!user) {
    res.set('WWW-Authenticate', 'Basic realm="auth-demo"')
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  req.user = user
  req.basic = { encoded, decoded }
  next()
}
