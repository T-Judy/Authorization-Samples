// In-memory "user table" stand-in for a real database.
// Passwords are stored in plain text ONLY because this is a demo
// Never do this in a real application; use bcrypt/argon2 to hash and salt passwords at rest.

let nextId = 1

const users = [
  {
    id: nextId++,
    username: 'demo',
    password: 'demo123',
  },
  {
    id: nextId++,
    username: 'congrats',
    password: 'you_read_code',
  },
]

export function getUserByCredentials(username, password) {
  return users.find((u) => u.username === username && u.password === password) || null
}

export function getUserByUsername(username) {
  return users.find((u) => u.username === username) || null
}

export function getUserById(id) {
  return users.find((u) => u.id === id) || null
}
