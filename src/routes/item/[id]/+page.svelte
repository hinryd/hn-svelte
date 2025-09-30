<script>
  import Comment from "$lib/Comment.svelte";
  import { beforeNavigate, goto } from "$app/navigation";

  /** @type {import('./$types').PageData} */
  export let data;

  beforeNavigate((navigation) => {
    if (
      navigation.to.url
        .toString()
        .startsWith("https://news.ycombinator.com/item?id=")
    ) {
      navigation.cancel();
      goto("/item/" + navigation.to.url.toString().split("=")[1]);
    }
  });
</script>

<svelte:head>
  <title>{data.title} | Svelte Hacker News</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-4 pb-20 overflow-y-auto h-full">
  <article>
    <a class="decoration-none text-orange-600 dark:text-orange-400 hover:underline" href={data.url} target="_blank" rel="noopener">
      <h1 class="m-0">{data.title}</h1>
      {#if data.domain}
        <small class="text-xs font-light text-gray-500 dark:text-gray-400">{data.domain}</small>
      {/if}
    </a>

    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
      {data.points} points by <a class="text-orange-500 hover:underline" href="/user/{data.user}">{data.user}</a>
      {data.time_ago}
    </p>

    {#if data.content}
      <div class="mt-4 content-html">
        {@html data.content}
      </div>
    {/if}
  </article>

  <div class="text-sm mt-6">
    <h2 class="text-lg font-semibold mb-4">Comments ({data.comments?.length || 0})</h2>
    {#each data.comments as comment}
      <Comment {comment} />
    {/each}
  </div>
</div>

<style>
  :global(.content-html p) {
    margin: 0.5em 0;
  }

  :global(.content-html a) {
    color: rgb(249, 115, 22);
    text-decoration: underline;
  }

  :global(.content-html pre) {
    background: rgb(243, 244, 246);
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  :global(html.dark .content-html pre) {
    background: rgb(31, 41, 55);
  }

  :global(.content-html code) {
    font-family: ui-monospace, monospace;
    font-size: 0.875em;
  }
</style>
