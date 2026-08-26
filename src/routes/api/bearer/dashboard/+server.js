import { json } from '@sveltejs/kit';
import { getUserIdByToken } from '$lib/server/tokens.js';
import { getUserById } from '$lib/server/users.js';

export async function GET({ request }) {
	const header = request.headers.get('authorization');
	if (!header?.startsWith('Bearer ')) {
		return json({ error: 'Missing bearer token' }, { status: 401 });
	}

	const token = header.slice('Bearer '.length).trim();
	const userId = getUserIdByToken(token);
	if (userId === null) {
		return json({ error: 'Invalid or expired token' }, { status: 401 });
	}

	const user = getUserById(userId);
	return json({
		username: user.username,
		token,
		header: `Bearer ${token}`
	});
}
