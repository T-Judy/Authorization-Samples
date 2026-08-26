import { json } from '@sveltejs/kit';

// You would want to add the JWT to a blacklist and then revoke them. Since I'm not using a database simply tell the client to drop the token.
export async function POST() {
	return json({ ok: true });s
}
