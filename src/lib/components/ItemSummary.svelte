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
        <span class="text-[var(--accent-strong)] font-semibold decoration-none hover:underline">
            <span class="inline-block overflow-hidden text-ellipsis w-full">{item.title}</span>
            {#if item.domain}
                <small class="text-xs font-light text-[var(--text-muted)]">
                    ({item.domain})
                </small>
            {/if}
        </span>
    </h4>
    <div class="text-xs text-[var(--text-secondary)]">
        {#if item.type === "job"}
            <p class="m-0">{item.time_ago}</p>
        {:else}
            <p class="m-0">
                {item.points} points by
                <span class="text-[var(--accent)] hover:text-[var(--accent-strong)] hover:underline"
                    >{item.user}</span
                >
                {item.time_ago} |
                <span class="text-[var(--text-muted)]">
                    {item.comments_count}
                    {item.comments_count === 1 ? "comment" : "comments"}
                </span>
            </p>
        {/if}
    </div>
</article>
