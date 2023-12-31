<script lang="ts">
  // Utils
  import { onNavigate, disableScrollHandling } from '$app/navigation';
  import { getFlash } from 'sveltekit-flash-message/client';

  // Stores
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { js_enabled } from '$lib/stores/js_status';

  // Components
  import SEO from '$components/SEO.svelte';
  import Navbar from '$components/Navbar.svelte';
  import { Toaster } from 'svelte-french-toast';
  import Flash from '$components/Flash.svelte';
  import ThemeSwitcher from '$components/ThemeSwitcher.svelte';

  // Styles
  import '../styles/app.css';

  export let data;

  const flash = getFlash(page, {
    clearAfterMs: 5000
  });

  if (browser) {
    $js_enabled = true;
  }

  // Disable scroll handling on same route navigation for theme switching
  onNavigate((navigation) => {
    const previous_route = navigation.from?.url.pathname;
    const current_route = navigation.to?.url.pathname;

    if (previous_route === current_route) {
      disableScrollHandling();
    }
  });
</script>

<SEO {...$page.data.metadata} url={$page.url.href} />

<Toaster />

<div class="flex min-h-screen flex-col bg-background font-primary text-foreground">
  <Navbar user={data.user} />

  <main class="container mx-auto flex flex-1 flex-col py-4">
    <slot />

    <div class="fixed bottom-5 right-0">
      <ThemeSwitcher />
    </div>
  </main>
</div>

{#if $flash}
  <div class="fixed bottom-0 w-full overflow-hidden">
    <Flash type={$flash.type} message={$flash?.message} />
  </div>
{/if}
