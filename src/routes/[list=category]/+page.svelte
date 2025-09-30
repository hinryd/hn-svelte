<script>
  import { onMount, onDestroy } from "svelte";
  import ItemSummary from "./ItemSummary.svelte";
  import ItemDetail from "$lib/ItemDetail.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  /** @type {import('./$types').PageData} */
  export let data;

  let allItems = [];
  let currentPage = 1;
  let isLoading = false;
  let hasMore = true;
  let sentinelElement;
  let selectedItemData = null;
  let loadingItem = false;
  let isDesktop = false;
  let observer;

  // Reactive statements
  $: selectedItem = $page.url.searchParams.get("item");

  $: if (data.items) {
    // Initialize items when data changes
    Promise.resolve(data.items).then((items) => {
      allItems = [...items];
      currentPage = 1;
      hasMore = true;
    });
  }

  $: if (selectedItem && data.selectedItem) {
    // Load selected item data when URL changes
    Promise.resolve(data.selectedItem).then((item) => {
      selectedItemData = item;
      loadingItem = false;
    });
  } else if (!selectedItem) {
    selectedItemData = null;
    loadingItem = false;
  }

  async function loadNextPage() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    const nextPage = currentPage + 1;

    try {
      const list =
        data.list === "top"
          ? "news"
          : data.list === "new"
            ? "newest"
            : data.list;
      const response = await fetch(
        `https://api.hnpwa.com/v0/${list}/${nextPage}.json`,
      );
      const items = await response.json();

      if (items && items.length > 0) {
        allItems = [...allItems, ...items];
        currentPage = nextPage;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
      hasMore = false;
    } finally {
      isLoading = false;
    }
  }

  async function selectItem(item, event) {
    event?.preventDefault();

    if (!isDesktop) {
      // On mobile, navigate to the standalone item page
      goto(`/item/${item.id}`);
      return;
    }

    // On desktop, update URL with query parameter
    loadingItem = true;
    goto(`/${data.list}?item=${item.id}`, { keepFocus: true, noScroll: true });

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

  function checkDesktop() {
    if (browser) {
      isDesktop = window.innerWidth >= 768;
    }
  }

  onMount(() => {
    checkDesktop();

    window.addEventListener("resize", checkDesktop);

    // Intersection Observer for infinite scroll
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelElement) {
      observer.observe(sentinelElement);
    }
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
    if (browser) {
      window.removeEventListener("resize", checkDesktop);
    }
  });
</script>

<svelte:head>
  <title>hn {data.list}</title>
  <meta
    name="description"
    content="Latest Hacker News stories in the {data.list} category"
  />
</svelte:head>

<div class="w-full h-full md:flex">
  <!-- Left Panel: List of posts -->
  <div
    class="w-full md:w-1/4 lg:w-1/4 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700"
  >
    <div class="flex flex-col gap-6 p-4 pb-20">
      {#each allItems as item, i}
        {#if item}
          <!-- sometimes we get bad data? TODO investigate -->
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
            {#if isDesktop}
              <div class="pointer-events-none">
                <ItemSummary {item} index={1 + i} />
              </div>
            {:else}
              <ItemSummary {item} index={1 + i} />
            {/if}
          </div>
        {/if}
      {/each}

      <!-- Sentinel element for infinite scroll -->
      <div
        bind:this={sentinelElement}
        class="h-10 flex items-center justify-center"
      >
        {#if isLoading}
          <div class="text-orange-400 animate-pulse">Loading more...</div>
        {:else if !hasMore}
          <div class="text-gray-400">No more items</div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Right Panel: Selected post details (desktop only) -->
  <div class="hidden md:block w-3/4 h-full overflow-hidden">
    <ItemDetail item={selectedItemData} loading={loadingItem} />
  </div>
</div>
