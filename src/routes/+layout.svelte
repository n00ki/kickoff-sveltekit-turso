<script lang="ts">
	// Utils
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
</script>

<SEO {...$page.data.metadata} url={$page.url.href} />

<Toaster />

<div class="font-primary flex min-h-screen flex-col bg-primary text-primary-foreground">
	<Navbar user={data.user} />

	<main class="container mx-auto flex flex-1 flex-col py-4">
		<slot />

		<div class="fixed bottom-5 right-0">
			<ThemeSwitcher />
		</div>
	</main>
</div>

{#if $flash}
	<div class="absolute bottom-0 w-full">
		<Flash type={$flash.type} message={$flash?.message} />
	</div>
{/if}
