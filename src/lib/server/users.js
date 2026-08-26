// Stand-in for a users table in a real database.
export const users = [{ id: 1, username: 'demo', password: 'demo123' }, { id: 2, username: 'congrats', password: 'you_read_code' }];

export function getUserByCredentials(username, password) {
	return users.find((u) => u.username === username && u.password === password) ?? null;
}

export function getUserById(id) {
	return users.find((u) => u.id === id) ?? null;
}
