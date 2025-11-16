<script>
    import "virtual:uno.css"
    import "modern-normalize/modern-normalize.css"
    import "../app.css"
    import { page } from "$app/state"
    import ThemeToggler from "$lib/components/ThemeToggler.svelte"
    import Navbar from "$lib/components/Navbar.svelte"

    let section = $derived(page.url.pathname.split("/")[1])
    let { children } = $props()
</script>

<Navbar {section} />

<main class="dark:text-white h-screen max-w-7xl mx-auto pt-14">
    {@render children?.()}
</main>

<ThemeToggler />
