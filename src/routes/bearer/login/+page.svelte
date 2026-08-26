<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';
	import { messages } from '$lib/stores/messages.js';

	let username = '';
	let password = '';

	async function submit() {
		messages.clear();
		const ok = await auth.loginBearer(username, password);
		if (ok) {
			goto('/bearer/dashboard');
		}
	}
</script>

<div class="row justify-content-center">
	<div class="col-md-5">
		<h2 class="mb-1">Bearer Token Login</h2>
		<p class="text-muted mb-4">
			Login once to receive a token. That token is used for all future requests.
		</p>

		<div class="card">
			<div class="card-body">
				<form on:submit|preventDefault={submit}>
					<div class="mb-3">
						<label class="form-label" for="bearer-username">Username</label>
						<input
							id="bearer-username"
							bind:value={username}
							type="text"
							class="form-control"
							autofocus
							required
						/>
					</div>
					<div class="mb-3">
						<label class="form-label" for="bearer-password">Password</label>
						<input
							id="bearer-password"
							bind:value={password}
							type="password"
							class="form-control"
							required
						/>
					</div>
					<button type="submit" class="btn btn-success w-100">Login &amp; Get Token</button>
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
					<li>On success, it looks up or creates a token row for that user (get-or-create)</li>
					<li>The token key comes back in the response and is kept in the Svelte auth store</li>
				</ol>
			</div>
		</div>
	</div>
</div>
