<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>{data.id} • Svelte Hacker News</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-6">
	<h1>{data.id}</h1>

	<div>
		<p>
			...joined <strong>{data.created}</strong>, and has <strong>{data.karma}</strong> karma
		</p>

		<p>
			<a class="text-orange-500 hover:underline" href="https://news.ycombinator.com/submitted?id={data.id}">submissions</a> /
			<a class="text-orange-500 hover:underline" href="https://news.ycombinator.com/threads?id={data.id}">comments</a> /
			<a class="text-orange-500 hover:underline" href="https://news.ycombinator.com/favorites?id={data.id}">favourites</a>
		</p>

		{#if data.about}
			<div class="about">
				{@html '<p>' + data.about}
			</div>
		{/if}
	</div>
</div>
