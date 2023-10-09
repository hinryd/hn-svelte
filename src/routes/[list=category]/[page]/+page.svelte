<script>
  import { onMount } from "svelte";
  import ItemSummary from "./ItemSummary.svelte";
  import { goto } from "$app/navigation";

  /** @type {import('./$types').PageData} */
  export let data;

  const PAGE_SIZE = 30;

  $: start = 1 + (data.page - 1) * PAGE_SIZE;
  $: prev = `/${data.list}/${data.page - 1}`;
  $: next = `/${data.list}/${data.page + 1}`;

  onMount(() => {
    document.addEventListener("keydown", (e) => {
      e.key === "ArrowLeft" && prev && data.page > 1 && goto(prev);
      e.key === "ArrowRight" && next && goto(next);
    });
  });
</script>

<svelte:head>
  <title>hn {data.list}</title>
  <meta
    name="description"
    content="Latest Hacker News stories in the {data.list} category"
  />
</svelte:head>

<div class="flex flex-col gap-6 p-4">
  {#each data.items as item, i}
    {#if item}
      <!-- sometimes we get bad data? TODO investigate -->
      <ItemSummary {item} index={start + i} />
    {/if}
  {/each}
  <div class="h-7" />
</div>

<div class="p-3 w-screen fixed bottom-0">
  <div class="flex justify-between items-center backdrop-blur">
    <a
      class="px-4 py-2 rounded bg-orange-400 text-black text-center decoration-none {data.page <=
        1 && 'opacity-30 pointer-events-none'}"
      href={prev}
    >
      👈🏿
    </a>

    page: {data.page}

    <a
      class="px-4 py-2 rounded bg-orange-400 text-black text-center decoration-none"
      href={next}>👉🏿</a
    >
  </div>
</div>
