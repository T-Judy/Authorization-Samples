import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

const ACCESS_SECRET = env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRY = env.JWT_ACCESS_EXPIRES_IN;
const REFRESH_EXPIRY = env.JWT_REFRESH_EXPIRES_IN;

export function signAccessToken(payload) {
	return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function signRefreshToken(payload) {
	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

// Throw error if invalid
export function verifyAccessToken(token) {
	return jwt.verify(token, ACCESS_SECRET);
}

// Throw error if invalid or outdated
export function verifyRefreshToken(token) {
	return jwt.verify(token, REFRESH_SECRET);
}
