<script>
  import Comment from "./Comment.svelte";
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

<div class="p-4">
  <article>
    <a class="decoration-none" href={data.url}>
      <h1 class="m-0">{data.title}</h1>
      {#if data.domain}<small class="text-xs font-light">{data.domain}</small
        >{/if}
    </a>

    <p>
      {data.points} points by <a href="/user/{data.user}">{data.user}</a>
      {data.time_ago}
    </p>

    {#if data.content}
      {@html data.content}
    {/if}
  </article>

  <div class="text-sm">
    {#each data.comments as comment}
      <Comment {comment} />
    {/each}
  </div>
</div>
