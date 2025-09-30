<script>
  import "virtual:uno.css";
  import "modern-normalize/modern-normalize.css";
  import "../app.css";
  import { page, navigating } from "$app/stores";
  import PreloadingIndicator from "$lib/PreloadingIndicator.svelte";
  import ThemeToggler from "$lib/ThemeToggler.svelte";
  import Navbar from "$lib/Navbar.svelte";

  $: section = $page.url.pathname.split("/")[1];
</script>

<Navbar {section} />

{#if $navigating}
  <PreloadingIndicator />
{/if}

<main class="dark:text-white w-full h-[calc(100vh-56px)]">
  <slot />
</main>

<ThemeToggler />
