import { json } from '@sveltejs/kit';
import { getUserByCredentials } from '$lib/server/users.js';

// This endpoint only exists so the UI can give immediate feedback before the browser starts sending the header for real.
export async function POST({ request }) {
	const { username, password } = await request.json();
	const user = getUserByCredentials(username, password);

	if (!user) {
		return json({ error: 'Invalid username or password' }, { status: 401 });
	}

	const credentials = Buffer.from(`${username}:${password}`).toString('base64');
	return json({ username: user.username, credentials });
}
