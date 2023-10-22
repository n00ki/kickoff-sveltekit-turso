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
	import { onMount } from 'svelte';

	export let data;

	const flash = getFlash(page, {
		clearAfterMs: 5000
	});

	if (browser) {
		$js_enabled = true;
	}

	// Set view height for mobile browsers
	onMount(() => {
		set_view_height();
		window.addEventListener('resize', set_view_height);
	});

	// Disable scroll handling on same route navigation for theme switching
	onNavigate((navigation) => {
		const previous_route = navigation.from?.url.pathname;
		const current_route = navigation.to?.url.pathname;

		if (previous_route === current_route) {
			disableScrollHandling();
		}
	});

	function set_view_height() {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}
</script>

<SEO {...$page.data.metadata} url={$page.url.href} />

<Toaster />

<div class="font-primary flex min-h-screen flex-col bg-background text-foreground">
	<Navbar user={data.user} />

	<main class="container mx-auto flex flex-1 flex-col py-4">
		<slot />

		<div class="fixed bottom-5 right-0">
			<ThemeSwitcher />
		</div>
	</main>
</div>

{#if $flash}
	<div class="absolute bottom-0 w-full overflow-hidden">
		<Flash type={$flash.type} message={$flash?.message} />
	</div>
{/if}
