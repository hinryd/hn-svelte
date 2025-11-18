<script>
    /** @type {import('./$types').PageData} */
    export let data
</script>

<svelte:head>
    <title>{data.id} • Svelte Hacker News</title>
</svelte:head>

<div
    class="max-w-4xl mx-auto p-6 mt-10 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl"
>
    <h1 class="text-2xl font-semibold text-[var(--accent-strong)] mb-2">{data.id}</h1>

    <div>
        <p>
            ...joined <strong>{data.created}</strong>, and has <strong>{data.karma}</strong> karma
        </p>

        <p>
            <a
                class="text-[var(--accent)] hover:text-[var(--accent-strong)] hover:underline"
                href="https://news.ycombinator.com/submitted?id={data.id}">submissions</a
            >
            /
            <a
                class="text-[var(--accent)] hover:text-[var(--accent-strong)] hover:underline"
                href="https://news.ycombinator.com/threads?id={data.id}">comments</a
            >
            /
            <a
                class="text-[var(--accent)] hover:text-[var(--accent-strong)] hover:underline"
                href="https://news.ycombinator.com/favorites?id={data.id}">favourites</a
            >
        </p>

        {#if data.about}
            <div class="about">
                {@html "<p>" + data.about}
            </div>
        {/if}
    </div>
</div>
