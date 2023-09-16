<script>
  /** @type {string} */
  export let section;

  const sections = ["top", "new", "show", "ask", "jobs"];
</script>

<nav class="sticky top-0 backdrop-blur overflow-x-auto">
  <div class="flex items-center mx-auto">
    <img
      alt="Svelte Hacker News logo"
      class="h-9 w-9"
      src="https://news.ycombinator.com/y18.svg"
    />

    <div class="flex gap-5 pl-4 font-medium text-gray-400">
      {#each sections as name}
        <div
          class="py-3 {section === name &&
            'border-0 border-b-2 border-solid border-orange-500'}"
        >
          <a
            class="decoration-none {section === name &&
              'text-black dark:text-white'}"
            href="/{name}/1">{name}</a
          >
        </div>
      {/each}
    </div>
  </div>
</nav>
