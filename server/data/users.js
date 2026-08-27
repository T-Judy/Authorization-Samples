// In-memory "user table" for the demo. 
// You should use a database table with hashed (likely via bcrypt) passwords, never plaintext.
const users = [
  { id: 1, username: 'demo', password: 'demo123' },
  { id: 2, username: 'congrats', password: 'you_read_code'}
];

function getUserByCredentials(username, password) {
  return users.find((u) => u.username === username && u.password === password) || null;
}

function getUserByUsername(username) {
  return users.find((u) => u.username === username) || null;
}

function getUserById(id) {
  return users.find((u) => u.id === id) || null;
}

module.exports = { users, getUserByCredentials, getUserByUsername, getUserById };
