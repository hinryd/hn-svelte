<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  /** @type {string} */
  export let section;

  let isTop = true;
  let searchQuery = "";
  let searchTimeout;

  // Sync search query with URL
  $: {
    const urlQuery = $page.url.searchParams.get('q');
    if (urlQuery !== searchQuery) {
      searchQuery = urlQuery || '';
    }
  }

  onMount(() => {
    window.addEventListener(
      "scroll",
      () => {
        isTop = window.scrollY < 25;
      },
      false,
    );
  });

  const sections = ["top", "new", "best", "show", "ask", "jobs"];

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const currentPath = $page.url.pathname;
      const itemParam = $page.url.searchParams.get('item');
      
      if (searchQuery.trim()) {
        // Add or update search query
        const params = new URLSearchParams();
        params.set('q', searchQuery.trim());
        if (itemParam) params.set('item', itemParam);
        goto(`${currentPath}?${params.toString()}`, { keepFocus: true, noScroll: true });
      } else {
        // Clear search query
        if (itemParam) {
          goto(`${currentPath}?item=${itemParam}`, { keepFocus: true, noScroll: true });
        } else {
          goto(currentPath, { keepFocus: true, noScroll: true });
        }
      }
    }, 300);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    clearTimeout(searchTimeout);
    handleSearchInput();
  }
</script>

<nav
  class="sticky top-0 w-full bg-white dark:bg-gray-900 backdrop-blur border-b border-gray-200 dark:border-gray-700 z-50"
>
  <div
    class="flex items-center justify-between backdrop-blur transition-all px-2 md:px-4"
  >
    <div class="flex items-center gap-3 flex-1">
      <img
        alt="Svelte Hacker News logo"
        class="h-11 w-11 {!isTop && 'rounded-l-md'}"
        src="/y18.svg"
      />

      <!-- Search Bar -->
      <form on:submit={handleSearchSubmit} class="relative flex-1 max-w-md">
        <input
          type="text"
          bind:value={searchQuery}
          on:input={handleSearchInput}
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
      </form>
    </div>

    <button
      class="md:hidden ml-2 p-2 border-0 bg-transparent dark:text-white"
      on:click={toggleMenu}
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

    <div
      class="hidden md:flex gap-5 px-4 font-medium text-gray-400 overflow-hidden"
    >
      {#each sections as name}
        <div
          class="py-3 {section === name &&
            'border-0 border-b-2 border-solid border-orange-500'}"
        >
          <a
            class="decoration-none {section === name &&
              'text-black dark:text-white'}"
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
          on:click={() => (isMenuOpen = false)}
        >
          {name}
        </a>
      {/each}
    </div>
  {/if}
</nav>
