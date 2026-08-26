<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import { messages } from '$lib/stores/messages.js';

	let username = '';
	let password = '';
	let loading = false;

	async function submit() {
		messages.clear();
		loading = true;
		const ok = await auth.loginJwt(username, password);
		loading = false;
		if (ok) {
			goto('/jwt/dashboard');
		}
	}
</script>

<div class="row justify-content-center">
	<div class="col-md-5">
		<h2 class="mb-1">JWT Login</h2>
		<p class="text-muted mb-4">Login once to receive a signed access token and a refresh token.</p>

		<div class="card">
			<div class="card-body">
				<form on:submit|preventDefault={submit}>
					<div class="mb-3">
						<label class="form-label" for="jwt-username">Username</label>
						<input
							id="jwt-username"
							bind:value={username}
							type="text"
							class="form-control"
							autofocus
							required
						/>
					</div>
					<div class="mb-3">
						<label class="form-label" for="jwt-password">Password</label>
						<input
							id="jwt-password"
							bind:value={password}
							type="password"
							class="form-control"
							required
						/>
					</div>
					<button type="submit" class="btn btn-primary w-100" disabled={loading}>
						{loading ? 'Signing in…' : 'Login & Get JWT'}
					</button>
				</form>
				<p class="small text-muted mt-3 mb-0">
					Demo account: <code>demo</code> / <code>demo123</code>
				</p>
			</div>
		</div>

		<div class="card mt-4">
			<div class="card-header">What happens when you submit</div>
			<div class="card-body small text-muted">
				<ol class="mb-0">
					<li>The SvelteKit server checks the username and password against its user table</li>
					<li>
						On success, it signs a token pair with <code>jsonwebtoken</code>
					</li>
					<li>
						The access token (15 min) and refresh token (7 days) come back in the response and are
						saved to the auth store
					</li>
				</ol>
			</div>
		</div>
	</div>
</div>
