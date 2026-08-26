import crypto from 'node:crypto';

// Stand-in for a token table in a real database
const tokensByUser = new Map();
const usersByToken = new Map();

function generateToken() {
	return crypto.randomBytes(24).toString('hex');
}

// Reuse an existing token for this user, or mint a new one
export function getOrCreateToken(userId) {
	let token = tokensByUser.get(userId);
	if (!token) {
		token = generateToken();
		tokensByUser.set(userId, token);
		usersByToken.set(token, userId);
	}
	return token;
}

export function getUserIdByToken(token) {
	return usersByToken.get(token) ?? null;
}

// Revocation
export function deleteToken(token) {
	const userId = usersByToken.get(token);
	if (userId !== undefined) {
		usersByToken.delete(token);
		tokensByUser.delete(userId);
	}
}
