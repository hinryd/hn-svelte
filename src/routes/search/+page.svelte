<script>
  import ItemSummary from "../[list=category]/ItemSummary.svelte";
  import ItemDetail from "$lib/components/ItemDetail.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let selectedItemData = null;
  let loadingItem = false;
  let isDesktop = false;

  $: selectedItem = $page.url.searchParams.get("item");

  async function selectItem(item, event) {
    event?.preventDefault();

    // Show overlay immediately with loading state
    selectedItemData = null;
    loadingItem = true;
    
    // Update URL with query parameter
    goto(`/search?q=${encodeURIComponent(data.query)}&item=${item.id}`, { keepFocus: true, noScroll: true });

    // Fetch the item data using HNPWA
    try {
      const response = await fetch(
        `https://api.hnpwa.com/v0/item/${item.id}.json`,
      );
      selectedItemData = await response.json();
    } catch (error) {
      console.error("Failed to load item:", error);
    } finally {
      loadingItem = false;
    }
  }

  function closeDetail() {
    loadingItem = false;
    selectedItemData = null;
    goto(`/search?q=${encodeURIComponent(data.query)}`, { keepFocus: true, noScroll: true });
  }

  function checkDesktop() {
    if (browser) {
      isDesktop = window.innerWidth >= 768;
    }
  }

  onMount(() => {
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  });
</script>

<svelte:head>
  <title>{data.query ? `Search: ${data.query}` : 'Search'} - HN</title>
  <meta
    name="description"
    content={data.query ? `Search results for "${data.query}" on Hacker News` : 'Search Hacker News'}
  />
</svelte:head>

<div class="w-full h-full md:flex relative">
  <!-- Left Panel: Search Results -->
  <div
    class="w-full md:w-1/2 lg:w-2/5 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700 {selectedItem || loadingItem ? 'hidden md:block' : ''}"
  >
    <div class="p-4">
      <!-- Search Header -->
      <div class="mb-6">
        {#if data.query}
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search Results
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Found <span class="font-semibold text-orange-500">{data.hits}</span> results for 
            <span class="font-semibold">"{data.query}"</span>
          </p>
        {:else}
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Enter a search query to find stories
          </p>
        {/if}
      </div>

      <!-- Results List -->
      {#if data.items.length === 0 && data.query}
        <div class="text-center py-12">
          <svg
            class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            No results found for "{data.query}"
          </p>
          <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Try a different search term
          </p>
        </div>
      {:else}
        <div class="flex flex-col gap-6 pb-20">
          {#each data.items as item, i}
            <div
              class="cursor-pointer transition-colors {selectedItem ===
              item.id.toString()
                ? 'bg-orange-50 dark:bg-gray-800 rounded-lg p-2 -m-2'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2'}"
              on:click={(e) => selectItem(item, e)}
              on:keydown={(e) => e.key === "Enter" && selectItem(item, e)}
              role="button"
              tabindex="0"
            >
              <div class="{isDesktop ? 'pointer-events-none' : ''}">
                <ItemSummary {item} index={i + 1} />
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Right Panel: Selected post details -->
  <div class="{selectedItem || loadingItem ? 'block' : 'hidden'} md:block md:w-1/2 lg:w-3/5 h-full overflow-hidden {(selectedItem || loadingItem) && !isDesktop ? 'absolute inset-0 z-50 bg-white dark:bg-gray-900' : ''}">
    {#if (selectedItem || loadingItem) && !isDesktop}
      <!-- Mobile close button -->
      <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center">
        <button
          on:click={closeDetail}
          class="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          aria-label="Back to results"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to results
        </button>
      </div>
    {/if}
    <ItemDetail item={selectedItemData} loading={loadingItem} />
  </div>
</div>
