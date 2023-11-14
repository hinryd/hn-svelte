<script>
  import { onMount } from "svelte";

  /** @type {string} */
  export let section;

  let isTop = true;

  onMount(() => {
    window.addEventListener(
      "scroll",
      () => {
        isTop = window.scrollY < 25;
      },
      false
    );
  });

  const sections = ["top", "new", "show", "ask", "jobs"];
</script>

<nav class="sticky top-0 overflow-x-auto max-w-4xl mx-auto">
  <div
    class="flex items-center backdrop-blur transition-all {!isTop &&
      'mx-3 mt-3 rounded-md shadow-md'}"
  >
    <img
      alt="Svelte Hacker News logo"
      class="h-11 w-11 {!isTop && 'rounded-l-md'}"
      src="/y18.svg"
    />

    <div class="flex gap-5 px-4 font-medium text-gray-400 overflow-x-scroll">
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
