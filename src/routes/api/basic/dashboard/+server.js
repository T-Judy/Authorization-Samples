import { json } from '@sveltejs/kit';
import { getUserByCredentials } from '$lib/server/users.js';

function parseBasicAuthHeader(header) {
	if (!header?.startsWith('Basic ')) return null;

	const encoded = header.slice('Basic '.length).trim();
	let decoded;
	try {
		decoded = Buffer.from(encoded, 'base64').toString('utf-8');
	} catch {
		return null;
	}

	const separatorIndex = decoded.indexOf(':');
	if (separatorIndex === -1) return null;

	return {
		username: decoded.slice(0, separatorIndex),
		password: decoded.slice(separatorIndex + 1),
		encoded,
		decoded
	};
}

export async function GET({ request }) {
	const parsed = parseBasicAuthHeader(request.headers.get('authorization'));
	if (!parsed) {
		return json({ error: 'Missing or malformed Authorization header' }, { status: 401 });
	}

	// Re-checked against the user table on this request
	const user = getUserByCredentials(parsed.username, parsed.password);
	if (!user) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	return json({
		username: user.username,
		credentials: parsed.encoded,
		decoded: parsed.decoded
	});
}
