import { json } from '@sveltejs/kit';
import { deleteToken } from '$lib/server/tokens.js';

export async function POST({ request }) {
	const header = request.headers.get('authorization');
	if (header?.startsWith('Bearer ')) {
		deleteToken(header.slice('Bearer '.length).trim());
	}
	return json({ ok: true });
}
