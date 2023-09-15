<script>
  /** @type {string} */
  export let section;

  const sections = ["top", "new", "show", "ask", "jobs"];
</script>

<nav
  class="sticky top-0 backdrop-blur overflow-x-auto border-b-5 border-orange-500"
>
  <div class="flex items-center mx-auto">
    <img
      alt="Svelte Hacker News logo"
      class="w-9 h-9"
      src="https://news.ycombinator.com/y18.svg"
    />

    <div class="flex px-4 gap-4 font-medium text-gray-400 decoration-none">
      {#each sections as name}
        <div>
          <a
            class={section === name &&
              "border-b-2 border-orange-500 text-black dark:text-white"}
            href="/{name}/1">{name}</a
          >
        </div>
      {/each}
    </div>
  </div>
</nav>
