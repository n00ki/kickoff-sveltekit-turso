<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { themes } from '$lib/utils/themes';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';

	let preferred_theme: string = $page.data.theme ?? themes.dark;

	const handle_set_theme_submit: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme');

		if (theme) {
			preferred_theme = theme;
			document.documentElement.setAttribute('class', theme);
		}
	};
</script>

<form method="POST" use:enhance={handle_set_theme_submit}>
	{#if preferred_theme === themes.dark}
		<Button
			id="light-theme-switcher"
			aria-label="Switch to light theme"
			formaction="/?/set_theme&theme={themes.light}&redirect_to={$page.url.pathname}"
			variant="outline"
			size="icon"
			class="rounded-r-none border-r-0"
		>
			<Sun />
		</Button>
	{:else}
		<Button
			id="dark-theme-switcher"
			aria-label="Switch to dark theme"
			formaction="/?/set_theme&theme={themes.dark}&redirect_to={$page.url.pathname}"
			variant="outline"
			size="icon"
			class="rounded-r-none border-r-0"
		>
			<Moon />
		</Button>
	{/if}
</form>
