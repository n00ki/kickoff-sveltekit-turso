<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { themes } from '$lib/utils/themes';

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
		<button
			id="light-theme-switcher"
			aria-label="Switch to light theme"
			formaction="/?/set_theme&theme={themes.light}&redirect_to={$page.url.pathname}"
			class=""
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
				/>
			</svg>
		</button>
	{:else}
		<button
			id="dark-theme-switcher"
			aria-label="Switch to dark theme"
			formaction="/?/set_theme&theme={themes.dark}&redirect_to={$page.url.pathname}"
			class="btn-ghost btn bg-base-200 rounded-l-md rounded-r-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
				/>
			</svg>
		</button>
	{/if}
</form>

<style>
	button {
		@apply rounded-l-md rounded-r-none bg-muted/20 p-2 text-primary-foreground transition-colors duration-300 ease-in-out;
	}

	button:hover {
		@apply bg-secondary/10;
	}
</style>
