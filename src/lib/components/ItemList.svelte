<script lang="ts">
    import { page } from "$app/state"
    import ItemSummary from "./ItemSummary.svelte"

    let { items }: { items: Item[] } = $props()

    let allItems = $state(items)
    let isLoading = $state(false)
    let hasMore = $state(true)
    let currentPage = $state(1)
    let observer: IntersectionObserver | undefined = $state()
    let sentinelElement: HTMLDivElement | undefined = $state()

    let list = $derived(page.params.list)
    let itemId = $derived(page.url.searchParams.get("item"))

    $effect(() => {
        allItems = [...items]
        currentPage = 1
        hasMore = true
    })

    $effect(() => {
        if (sentinelElement && !observer) {
            observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore && !isLoading) {
                        loadNextPage()
                    }
                },
                { threshold: 0.1 }
            )
            observer.observe(sentinelElement)
        }
        // return () => {
        //     observer?.disconnect()
        // }
    })

    async function loadNextPage() {
        if (isLoading || !hasMore) return

        isLoading = true
        const nextPage = currentPage + 1

        try {
            const parsedList = list === "top" ? "news" : list === "new" ? "newest" : list
            const response = await fetch(`https://api.hnpwa.com/v0/${parsedList}/${nextPage}.json`)
            const fetchedItems = await response.json()

            if (fetchedItems && fetchedItems.length > 0) {
                allItems = [...allItems, ...fetchedItems]
                currentPage = nextPage
            } else {
                hasMore = false
            }
        } catch (error) {
            console.error("Failed to load more items:", error)
            hasMore = false
        } finally {
            isLoading = false
        }
    }
</script>

<div class="flex flex-col">
    {#each allItems as item, i}
        {#if item}
            <a
                href="/{list}?item={item.id}"
                class="block transition-all p-4 rounded-xl {itemId === item.id.toString()
                    ? 'bg-[var(--accent-soft)]'
                    : 'hover:bg-[var(--bg-subtle)]'}"
            >
                <ItemSummary {item} index={i + 1} />
            </a>
        {/if}
    {/each}

    <!-- Sentinel element for infinite scroll -->
    <div bind:this={sentinelElement} class="h-10 flex items-center justify-center">
        {#if isLoading}
            <div class="text-[var(--accent)] animate-pulse">Loading more...</div>
        {:else if !hasMore}
            <div class="text-[var(--text-muted)]">No more items</div>
        {/if}
    </div>
</div>
