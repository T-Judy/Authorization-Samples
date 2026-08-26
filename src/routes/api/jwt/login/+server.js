import { json } from '@sveltejs/kit';
import { getUserByCredentials } from '$lib/server/users.js';
import { signAccessToken, signRefreshToken } from '$lib/server/jwt.js';

export async function POST({ request }) {
	const { username, password } = await request.json();
	const user = getUserByCredentials(username, password);

	if (!user) {
		return json({ error: 'Invalid username or password' }, { status: 401 });
	}

	const payload = { sub: user.id, username: user.username };
	const accessToken = signAccessToken(payload);
	const refreshToken = signRefreshToken(payload);

	return json({ accessToken, refreshToken });
}
