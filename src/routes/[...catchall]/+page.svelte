<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let timer;

	onMount(() => {
		timer = setTimeout(() => goto('/'), 3000);
	});
	onDestroy(() => clearTimeout(timer));
</script>

<div class="d-flex align-items-center justify-content-center" style="min-height: 60vh">
	<div class="card mx-auto" style="max-width: 640px">
		<div class="card-body text-center">
			<h1 class="display-5">404</h1>
			<p class="lead">Sorry, the page you requested was not found.</p>
			<p class="text-muted">
				You will be redirected to the home page in 3 seconds.
				<a href="/">Click here</a> to go immediately.
			</p>
		</div>
	</div>
</div>
