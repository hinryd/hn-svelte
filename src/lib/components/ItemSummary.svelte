<script lang="ts">
    let {
        item,
        index
    }: {
        item: Item
        index: number
    } = $props()
</script>

<article>
    <h4 class="m-0">
        <span
            class="text-orange-600 dark:text-orange-400 font-bold decoration-none hover:underline"
        >
            <span class="inline-block overflow-hidden text-ellipsis w-full">{item.title}</span>
            {#if item.domain}
                <small class="text-xs font-light text-gray-500 dark:text-gray-400">
                    ({item.domain})
                </small>
            {/if}
        </span>
    </h4>
    <div class="text-xs text-gray-600 dark:text-gray-400">
        {#if item.type === "job"}
            <p class="m-0">{item.time_ago}</p>
        {:else}
            <p class="m-0">
                {item.points} points by
                <span class="text-orange-500 dark:text-violet-400 hover:underline">{item.user}</span
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
