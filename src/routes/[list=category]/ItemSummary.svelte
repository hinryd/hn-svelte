<script>
  /**
   * @type {{
   *   domain?: string;
   *   id: string;
   *   url: string;
   *   title: string;
   *   type: string;
   *   time_ago: string;
   *   points: number;
   *   user: string;
   *   comments_count: number;
   * }}
   */
  export let item;

  /** @type {number} */
  // export let index;
</script>

<article>
  <h4 class="m-0">
    <a
      class="text-orange-600 dark:text-orange-400 font-bold decoration-none hover:underline"
      href={item.domain ? item.url : `/item/${item.id}`}
      target={item.domain ? "_blank" : "_self"}
      rel={item.domain ? "noopener noreferrer" : ""}
    >
      <span class="inline-block overflow-hidden text-ellipsis w-full"
        >{item.title}</span
      >
      {#if item.domain}
        <small class="text-xs font-light text-gray-500 dark:text-gray-400">
          ({item.domain})
        </small>
      {/if}
    </a>
  </h4>
  <div class="text-xs text-gray-600 dark:text-gray-400">
    {#if item.type === "job"}
      <p class="m-0">{item.time_ago}</p>
    {:else}
      <p class="m-0">
        {item.points} points by
        <a
          class="text-orange-500 dark:text-violet-400 hover:underline"
          href="/user/{item.user}"
          on:click={(e) => e.stopPropagation()}>{item.user}</a
        >
        {item.time_ago} |
        <span class="text-gray-500 dark:text-gray-400">
          {item.comments_count}
          {item.comments_count === 1 ? "comment" : "comments"}
        </span>
      </p>
    {/if}
  </div>
</article>
