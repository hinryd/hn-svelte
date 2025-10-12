<script>
    import "virtual:uno.css"
    import "modern-normalize/modern-normalize.css"
    import "../app.css"
    import { page, navigating } from "$app/state"
    import PreloadingIndicator from "$lib/components/PreloadingIndicator.svelte"
    import ThemeToggler from "$lib/components/ThemeToggler.svelte"
    import Navbar from "$lib/components/Navbar.svelte"

    let section = $derived(page.url.pathname.split("/")[1])
    let { children } = $props()
</script>

<Navbar {section} />

<main class="dark:text-white h-screen pt-12">
    {@render children?.()}
</main>

<!-- <ThemeToggler /> -->
