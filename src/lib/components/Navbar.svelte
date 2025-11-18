<script lang="ts">
    import { onMount } from "svelte"
    import { slide, fade } from "svelte/transition"
    import { page } from "$app/state"
    import { afterNavigate } from "$app/navigation"

    let { section }: { section: string } = $props()

    let isSearching = $state(false)
    let isMenuOpen = $state(false)
    let searchQuery = $state("")
    let showSearchResults = $state(false)
    let searchTimeout: ReturnType<typeof setTimeout> | undefined
    let searchResults: HNAlgoliaHit[] = $state([])
    let list = $derived(page.params.list)

    afterNavigate(() => {
        showSearchResults = false
    })

    const sections = ["top", "new", "best", "show", "ask", "jobs"]

    onMount(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".search-container")) {
                showSearchResults = false
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    })

    function debounceSearch() {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(async () => {
            if (!searchQuery.trim()) {
                searchResults = []
                showSearchResults = false
                return
            }

            isSearching = true
            showSearchResults = true

            try {
                const uri = encodeURIComponent(searchQuery)
                const response = await fetch(
                    `https://hn.algolia.com/api/v1/search?query=${uri}&tags=story&hitsPerPage=10`
                )
                const data = await response.json()
                searchResults = data.hits.map((hit) => ({
                    id: hit.objectID,
                    title: hit.title || hit.story_title,
                    points: hit.points,
                    author: hit.author,
                    num_comments: hit.num_comments,
                    created_at: hit.created_at
                }))
            } catch (error) {
                console.error("Search failed:", error)
                searchResults = []
            } finally {
                isSearching = false
            }
        }, 300)
    }

    function formatTimeAgo(dateString: string) {
        const date = new Date(dateString)
        const now = new Date()
        const diff = Math.floor((now - date) / 1000)

        if (diff < 60) return "just now"
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }
</script>

<nav class="fixed top-0 w-full z-50 border-b border-[var(--navbar-border)] bg-[var(--navbar-blur)]">
    <div
        class="flex items-center justify-between transition-all px-2 md:px-4 py-2 max-w-7xl mx-auto"
    >
        <div class="flex items-center gap-3 flex-1">
            <img alt="Svelte Hacker News logo" class="h-10 w-10" src="/y18.svg" />

            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md search-container">
                <div class="relative">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        oninput={debounceSearch}
                        onfocus={() => searchQuery && (showSearchResults = true)}
                        placeholder="Search stories..."
                        class="w-full py-2.5 pl-10 pr-4 text-sm rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                    />
                    <svg
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {#if isSearching}
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div
                                class="animate-spin h-4 w-4 border-2 border-[var(--accent)] border-t-transparent rounded-full"
                            ></div>
                        </div>
                    {/if}
                </div>

                {#if showSearchResults}
                    <div
                        class="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl max-h-96 overflow-y-auto z-20 min-w-[300px]"
                        transition:fade={{ duration: 50 }}
                    >
                        {#if isSearching}
                            <div class="p-4 text-center text-[var(--text-muted)]">Searching...</div>
                        {:else if searchResults.length === 0 && searchQuery}
                            <div class="p-4 text-center text-[var(--text-muted)]">
                                No results found for "{searchQuery}"
                            </div>
                        {:else}
                            <div class="flex flex-col">
                                {#each searchResults as result}
                                    <a
                                        class="cursor-pointer block px-3 py-2.5 hover:bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] last:border-b-0 transition-colors"
                                        href="/{list}?item={result.id}"
                                        onclick={() => {
                                            showSearchResults = false
                                            searchQuery = ""
                                        }}
                                    >
                                        <div class="font-medium text-[var(--text-primary)]">
                                            {result.title}
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>

        <button
            class="md:hidden ml-2 p-2 border-0 bg-transparent dark:text-white"
            onclick={() => (isMenuOpen = !isMenuOpen)}
            aria-label="Toggle menu"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                ></path>
            </svg>
        </button>

        <div class="hidden md:flex gap-5 px-4 font-medium text-[var(--text-muted)] overflow-hidden">
            {#each sections as name}
                <div
                    class="py-3 border-b-2 border-transparent {section === name &&
                        'border-[var(--accent)]'}"
                >
                    <a
                        class="decoration-none text-xs md:text-sm uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors {section ===
                            name && 'text-[var(--text-primary)]'}"
                        href="/{name}">{name}</a
                    >
                </div>
            {/each}
        </div>
    </div>

    {#if isMenuOpen}
        <div
            class="md:hidden bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)]"
            transition:slide
        >
            {#each sections as name}
                <a
                    class="block py-2.5 px-4 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] {section ===
                        name && 'bg-[var(--accent-soft)] text-[var(--text-primary)]'}"
                    href="/{name}"
                    onclick={() => (isMenuOpen = false)}
                >
                    {name}
                </a>
            {/each}
        </div>
    {/if}
</nav>
