<script>
	import { page } from '$app/state';

	const offline = typeof navigator !== 'undefined' && navigator.onLine === false;

	const title = offline ? `You're offline` : page.status;
	const message = offline
		? 'Find internet and try again'
		: page.error
			? page.error.message
			: 'Unknown error';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="h-full w-full flex flex-col gap-10 justify-center items-center">
	<h1 class="font-mono text-6xl">{title}</h1>

	<pre>{message}</pre>
</div>

<style>
</style>
