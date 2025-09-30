<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  /** @type {string} */
  export let section;

  let isTop = true;

  onMount(() => {
    window.addEventListener(
      "scroll",
      () => {
        isTop = window.scrollY < 25;
      },
      false,
    );
  });

  const sections = ["top", "new", "show", "ask", "jobs"];

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<nav
  class="sticky top-0 overflow-x-auto w-full bg-transparent backdrop-blur border-b border-gray-200 dark:border-gray-700 z-50"
>
  <div class="flex items-center justify-between backdrop-blur transition-all">
    <div class="flex items-center">
      <img
        alt="Svelte Hacker News logo"
        class="h-11 w-11 {!isTop && 'rounded-l-md'}"
        src="/y18.svg"
      />
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
