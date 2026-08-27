// In-memory "token table" for the Bearer Token
// Keyed by token string -> userId, so lookup on each request is O(1).

import crypto from 'node:crypto'

const tokensByValue = new Map() // token -> userId
const tokenByUserId = new Map() // userId -> token

function generateToken() {
  return crypto.randomBytes(24).toString('hex')
}

// get-or-create: if the user already has a live token, reuse it instead of minting a new one on every login.
export function getOrCreateToken(userId) {
  const existing = tokenByUserId.get(userId)
  if (existing) return existing

  const token = generateToken()
  tokensByValue.set(token, userId)
  tokenByUserId.set(userId, token)
  return token
}

export function getUserIdByToken(token) {
  return tokensByValue.has(token) ? tokensByValue.get(token) : null
}

export function revokeToken(token) {
  const userId = tokensByValue.get(token)
  if (userId === undefined) return false
  tokensByValue.delete(token)
  tokenByUserId.delete(userId)
  return true
}
