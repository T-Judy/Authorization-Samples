import { json } from '@sveltejs/kit';
import { getUserByCredentials } from '$lib/server/users.js';
import { getOrCreateToken } from '$lib/server/tokens.js';

export async function POST({ request }) {
	const { username, password } = await request.json();
	const user = getUserByCredentials(username, password);

	if (!user) {
		return json({ error: 'Invalid username or password' }, { status: 401 });
	}

	const token = getOrCreateToken(user.id);
	return json({ username: user.username, token });
}
