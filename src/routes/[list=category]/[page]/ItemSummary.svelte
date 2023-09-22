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
  export let index;
</script>

<article>
  <h4 class="m-0">
    <a
      class="text-orange-600 font-bold decoration-none"
      href={item.domain ? item.url : `/item/${item.id}`}
    >
      <span class="inline-block overflow-hidden text-ellipsis w-full"
        >{item.title}</span
      >
      {#if item.domain}<small class="text-xs font-light">({item.domain})</small
        >{/if}
    </a>
  </h4>
  <div class="text-xs">
    {#if item.type === "job"}
      <p class="m-0">{item.time_ago}</p>
    {:else}
      <p class="m-0">
        {item.points} points by
        <a class="dark:text-violet-400" href="/user/{item.user}">{item.user}</a>
        {item.time_ago} |
        <a class="dark:text-violet-400" href="/item/{item.id}">
          {item.comments_count}
          {item.comments_count === 1 ? "comment" : "comments"}
        </a>
      </p>
    {/if}
  </div>
</article>
