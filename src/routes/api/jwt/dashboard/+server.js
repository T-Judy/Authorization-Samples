import { json } from '@sveltejs/kit';
import { verifyAccessToken } from '$lib/server/jwt.js';

export async function GET({ request }) {
	const header = request.headers.get('authorization');
	if (!header?.startsWith('Bearer ')) {
		return json({ error: 'Missing access token' }, { status: 401 });
	}

	const token = header.slice('Bearer '.length).trim();

	let payload;
	try {
		// Recomputes the signature to confirm nothing was tampered with.
		payload = verifyAccessToken(token);
	} catch {
		return json({ error: 'Invalid or expired token' }, { status: 401 });
	}

	return json({
		username: payload.username,
		accessToken: token,
		header: `Bearer ${token}`,
		payload,
		exp: payload.exp,
		iat: payload.iat
	});
}
