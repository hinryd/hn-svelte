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

<main
    class="h-screen max-w-7xl mx-auto pt-16 px-2 md:px-4 bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300 ease-in-out"
>
    {@render children?.()}
</main>

<ThemeToggler />
