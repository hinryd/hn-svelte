<script lang="ts">
    import { goto } from "$app/navigation"
    import { page } from "$app/state"
    import ItemDetail from "$lib/components/ItemDetail.svelte"
    import ItemList from "$lib/components/ItemList.svelte"

    let { data } = $props()

    let items = $state(data.items)
    let list = $derived(page.params.list)
    let itemId = $derived(page.url.searchParams.get("item"))
    let hasOverlay = $derived(!!itemId)
</script>

<svelte:head>
    <title>hn {list}</title>
    <meta name="description" content="Latest Hacker News stories in the {list} category" />
</svelte:head>

<div class="h-full w-full md:flex relative">
    <div
        class="w-full md:w-2/5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 pb-20 {hasOverlay
            ? 'hidden md:block'
            : ''}"
    >
        <ItemList {items} />
    </div>

    <div class="{hasOverlay ? 'block' : 'hidden'} md:block md:w-3/5 h-full overflow-hidden">
        {#if hasOverlay}
            <div
                class="md:hidden sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 p-3"
            >
                <a
                    href="/{list}"
                    class="w-full flex flex-nowrap items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span>Back</span>
                </a>
            </div>
        {/if}

        <ItemDetail item={data.selectedItem} />
    </div>
</div>
