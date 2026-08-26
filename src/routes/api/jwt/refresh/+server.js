import { json } from '@sveltejs/kit';
import { verifyRefreshToken, signAccessToken } from '$lib/server/jwt.js';

export async function POST({ request }) {
	const { refreshToken } = await request.json();
	if (!refreshToken) {
		return json({ error: 'Missing refresh token' }, { status: 400 });
	}

	let payload;
	try {
		payload = verifyRefreshToken(refreshToken);
	} catch {
		return json({ error: 'Invalid or expired refresh token' }, { status: 401 });
	}

	const accessToken = signAccessToken({ sub: payload.sub, username: payload.username });
	return json({ accessToken });
}
