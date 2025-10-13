<script lang="ts">
    import Comment from "./CommentView.svelte"

    let { item }: { item: Item | null } = $props()
</script>

{#if item}
    <div class="relative h-full overflow-y-auto p-4 pb-20">
        <article>
            <a class="decoration-none" href={item.url} target="_blank" rel="noopener">
                <h1 class="m-0 text-2xl font-bold mb-2">{item.title}</h1>
                {#if item.domain}
                    <small class="text-xs font-light text-gray-500">{item.domain}</small>
                {/if}
            </a>

            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {item.points} points by
                <a class="text-orange-500 hover:underline" href="/user/{item.user}">{item.user}</a>
                {item.time_ago}
            </p>

            {#if item.content}
                <div class="mt-4 text-sm leading-relaxed content-html">
                    {@html item.content}
                </div>
            {/if}
        </article>

        <div class="mt-6 text-sm">
            <h2 class="text-lg font-semibold mb-4">
                Comments ({item.comments_count})
            </h2>
            {#if item.comments && item.comments.length > 0}
                {#each item.comments as comment}
                    <Comment {comment} />
                {/each}
            {:else}
                <p class="text-gray-500">No comments yet.</p>
            {/if}
        </div>
    </div>
{:else}
    <div class="md:flex items-center justify-center h-full p-8 text-center">
        <div class="text-gray-400">
            <svg
                class="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            <p class="text-lg">Select a post to view details</p>
        </div>
    </div>
{/if}
