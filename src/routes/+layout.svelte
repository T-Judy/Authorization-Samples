<script>
	import { messages } from '$lib/stores/messages.js';
</script>

<nav class="navbar navbar-expand navbar-dark bg-dark mb-4">
	<div class="container">
		<a class="navbar-brand" href="/">Svelte Auth Demo</a>
		<div class="navbar-nav">
			<a class="nav-link" href="/basic/login">Basic</a>
			<a class="nav-link" href="/bearer/login">Bearer</a>
			<a class="nav-link" href="/jwt/login">JWT</a>
		</div>
	</div>
</nav>

<div class="container pb-5">
	{#if $messages.error}
		<div class="alert alert-danger alert-dismissible fade show" role="alert">
			{$messages.error}
			<button
				type="button"
				class="btn-close"
				aria-label="Close"
				on:click={() => messages.clear()}
			></button>
		</div>
	{/if}
	{#if $messages.success}
		<div class="alert alert-success alert-dismissible fade show" role="alert">
			{$messages.success}
			<button
				type="button"
				class="btn-close"
				aria-label="Close"
				on:click={() => messages.clear()}
			></button>
		</div>
	{/if}

	<slot />
</div>
