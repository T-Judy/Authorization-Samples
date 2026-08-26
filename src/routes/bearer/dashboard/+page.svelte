<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.js';

	$: dashboard = $auth.bearerDashboard;

	onMount(async () => {
		const ok = await auth.fetchBearerDashboard();
		if (!ok) goto('/bearer/login');
	});

	async function logout() {
		await auth.logoutBearer();
		goto('/bearer/login');
	}
</script>

{#if dashboard}
	<div class="d-flex justify-content-between align-items-center mb-4">
		<div>
			<h2 class="mb-0">Bearer Token Dashboard</h2>
			<p class="text-muted mb-0">Logged in as <strong>{dashboard.username}</strong></p>
		</div>
		<button class="btn btn-outline-secondary" on:click={logout}>Logout</button>
	</div>

	<div class="row g-4">
		<div class="col-md-6">
			<div class="card h-100">
				<div class="card-header bg-success text-white">Your Token</div>
				<div class="card-body">
					<p class="small text-muted">
						This token lives in the server's in-memory token table and is sent on every request:
					</p>
					<code class="d-block bg-light p-3 rounded" style="word-break: break-all">
						{dashboard.token}
					</code>
					<hr />
					<p class="small text-muted mb-1">Full authorization header:</p>
					<code class="d-block bg-light p-3 rounded" style="word-break: break-all">
						{dashboard.header}
					</code>
				</div>
			</div>
		</div>

		<div class="col-md-6">
			<div class="card h-100">
				<div class="card-header">Security Properties</div>
				<div class="card-body">
					<table class="table table-sm mb-0">
						<tbody>
							<tr>
								<td class="text-muted">Credentials exposed</td>
								<td><span class="badge bg-success">Login only</span></td>
							</tr>
							<tr>
								<td class="text-muted">Server-side storage</td>
								<td><span class="badge bg-warning text-dark">One row per user</span></td>
							</tr>
							<tr>
								<td class="text-muted">Token expiry</td>
								<td><span class="badge bg-danger">None by default</span></td>
							</tr>
							<tr>
								<td class="text-muted">Revocation</td>
								<td><span class="badge bg-success">Easy; delete the row</span></td>
							</tr>
							<tr>
								<td class="text-muted">Lookups per request</td>
								<td><span class="badge bg-warning text-dark">One token lookup</span></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="col-12">
			<div class="card">
				<div class="card-header">How This Worked</div>
				<div class="card-body small text-muted">
					<ol class="mb-0">
						<li>You submitted the login form and the SvelteKit server verified your credentials</li>
						<li>
							It ran the equivalent of <code>get_or_create</code> against its in-memory token table
							(<code>src/lib/server/tokens.js</code>)
						</li>
						<li>The token key came back in the login response and was kept in the Svelte auth store</li>
						<li>
							Loading this dashboard sent <code>{dashboard.header}</code>, and the server's
							<code>/api/bearer/dashboard</code> endpoint looked that key up in the token table
						</li>
						<li>Logging out deletes the row server-side so that the token stops working immediately</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
{:else}
	<p class="text-muted small">Looking up your token…</p>
{/if}
