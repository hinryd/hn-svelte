<script lang="ts">
    import { onMount } from "svelte"
    import { slide, fade } from "svelte/transition"
    import { goto } from "$app/navigation"
    import { page } from "$app/state"

    let { section }: { section: string } = $props()

    let isTop = $state(true)
    let isSearching = $state(false)
    let isMenuOpen = $state(false)
    let searchQuery = $state("")
    let searchResults = $state([])
    let showSearchResults = $state(false)

    let query = $derived(page.url.searchParams.get("q"))
    const sections = ["top", "new", "best", "show", "ask", "jobs"]

    onMount(() => {
        window.addEventListener(
            "scroll",
            () => {
                isTop = window.scrollY < 25
            },
            false
        )

        const handleClickOutside = (e) => {
            if (!e.target.closest(".search-container")) {
                showSearchResults = false
            }
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    })

    async function handleSearch(e: Event) {
        e.preventDefault()

        isSearching = true
        showSearchResults = true

        const item = page.url.searchParams.get("item")

        goto(`/${page.params.list}?${item ? `item=${item}` : ""}${query ? `&q=${query}` : ""}`, {
            keepFocus: true,
            replaceState: false
        })

        if (!query.trim()) {
            searchResults = []
            showSearchResults = false
            return
        }

        try {
            const uri = encodeURIComponent(query)
            console.log("thisis uri", uri)
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
    }

    function selectResult(id) {
        showSearchResults = false
        searchQuery = ""
        goto(`/item/${id}`)
    }

    function formatTimeAgo(dateString) {
        const date = new Date(dateString)
        const now = new Date()
        const diff = Math.floor((now - date) / 1000)

        if (diff < 60) return "just now"
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
        return `${Math.floor(diff / 86400)}d ago`
    }
</script>

<nav
    class="fixed top-0 w-full bg-white dark:bg-gray-900 backdrop-blur border-b border-gray-200 dark:border-gray-700 z-50"
>
    <div class="flex items-center justify-between backdrop-blur transition-all">
        <div class="flex items-center gap-3 flex-1">
            <img alt="Svelte Hacker News logo" class="h-11 w-11" src="/y18.svg" />

            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md search-container">
                <div class="relative">
                    <input
                        type="text"
                        oninput={handleSearch}
                        onfocus={() => searchQuery && (showSearchResults = true)}
                        placeholder="Search stories..."
                        class="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
                                class="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"
                            ></div>
                        </div>
                    {/if}
                </div>

                {#if showSearchResults}
                    <div
                        class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-[100] min-w-[300px]"
                        transition:fade={{ duration: 150 }}
                    >
                        {#if isSearching}
                            <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                                Searching...
                            </div>
                        {:else if searchResults.length === 0 && searchQuery}
                            <div class="p-4 text-center text-gray-500 dark:text-gray-400">
                                No results found for "{searchQuery}"
                            </div>
                        {:else}
                            {#each searchResults as result}
                                <button
                                    class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                                    onclick={() => selectResult(result.id)}
                                >
                                    <div class="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                        {result.title}
                                    </div>
                                    <div
                                        class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400"
                                    >
                                        <span>{result.points} points</span>
                                        <span>·</span>
                                        <span>by {result.author}</span>
                                        <span>·</span>
                                        <span>{formatTimeAgo(result.created_at)}</span>
                                        <span>·</span>
                                        <span>{result.num_comments} comments</span>
                                    </div>
                                </button>
                            {/each}
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
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                ></path>
            </svg>
        </button>

        <div class="hidden md:flex gap-5 px-4 font-medium text-gray-400 overflow-hidden">
            {#each sections as name}
                <div
                    class="py-3 {section === name &&
                        'border-0 border-b-2 border-solid border-orange-500'}"
                >
                    <a
                        class="decoration-none {section === name && 'text-black dark:text-white'}"
                        href="/{name}">{name}</a
                    >
                </div>
            {/each}
        </div>
    </div>

    {#if isMenuOpen}
        <div class="md:hidden bg-white dark:bg-gray-800 shadow-md" transition:slide>
            {#each sections as name}
                <a
                    class="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 {section ===
                        name && 'bg-gray-200 dark:bg-gray-700'}"
                    href="/{name}"
                    onclick={() => (isMenuOpen = false)}
                >
                    {name}
                </a>
            {/each}
        </div>
    {/if}
</nav>
