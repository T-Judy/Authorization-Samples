// In-memory "user table" for the demo. In a real app this would be a database
// with hashed passwords (bcrypt/argon2) -- plaintext is only here so the demo
// is easy to read end to end.
export const users = [
  { id: 1, username: 'demo', password: 'demo123' },
];

export function getUserByCredentials(username, password) {
  return (
    users.find((u) => u.username === username && u.password === password) || null
  );
}

export function getUserByUsername(username) {
  return users.find((u) => u.username === username) || null;
}

export function getUserById(id) {
  return users.find((u) => u.id === id) || null;
}
