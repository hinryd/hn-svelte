<script>
  import ItemSummary from "./ItemSummary.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  const PAGE_SIZE = 30;

  $: start = 1 + (data.page - 1) * PAGE_SIZE;
  $: prev = `/${data.list}/${data.page - 1}`;
  $: next = `/${data.list}/${data.page + 1}`;
</script>

<svelte:head>
  <title>Svelte Hacker News</title>
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

  <div class="flex justify-between items-center">
    {#if data.page > 1}
      <a
        class="p-4 rounded bg-orange-400 text-black text-center decoration-none"
        href={prev}
      >
        prev
      </a>
    {/if}

    page: {data.page}

    {#if next}
      <a
        class="p-4 rounded bg-orange-400 text-black text-center decoration-none"
        href={next}>next</a
      >
    {/if}
  </div>
</div>
