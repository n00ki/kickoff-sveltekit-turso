<script lang="ts">
	// Utils
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';

	// Icons
	import { HamburgerMenu, Exit, Cross1 } from 'radix-icons-svelte';

	// Components
	import { Button } from '$lib/components/ui/button';

	export let user: object | null = null;
	let menu_open = false;

	const toggle_menu_state = (e: Event) => {
		if (e.type === 'focusout' && !menu_open) return;
		menu_open = !menu_open;
	};
</script>

<nav>
	<div class="flex items-center justify-between p-4">
		<div class="flex-1 px-2">
			<a href="/" class="btn-ghost btn text-xl font-bold normal-case">Kickoff SvelteKit</a>
		</div>

		<div class="hidden gap-2 lg:inline-flex">
			{#if !user}
				<Button href="/login" variant="outline">Login</Button>
				<Button href="/register" variant="outline">Register</Button>
			{:else}
				<Button href="/profile" variant="outline">Profile</Button>
				<Button form="logout" type="submit" variant="outline">
					<Exit class="mr-1 h-4 w-4" />
					Log out
				</Button>
			{/if}
		</div>

		<!-- Mobile Menu Icon -->
		<div class="lg:hidden">
			<Button on:click={toggle_menu_state} variant="ghost">
				{#if menu_open}
					<Cross1 />
				{:else}
					<HamburgerMenu />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	{#if menu_open}
		<div transition:slide class="flex w-full flex-col gap-2 bg-accent p-4 text-accent-foreground">
			{#if !user}
				<Button href="/login" variant="link" on:click={toggle_menu_state}>Login</Button>
				<Button href="/register" variant="link" on:click={toggle_menu_state}>Register</Button>
			{:else}
				<Button href="/profile" variant="link" on:click={toggle_menu_state}>Profile</Button>
				<Button form="logout" type="submit" variant="link" on:click={toggle_menu_state}>
					<Exit class="mr-1 h-4 w-4" />
					Log out
				</Button>
			{/if}
		</div>
	{/if}

	<form
		id="logout"
		action="/logout"
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				await applyAction(result);
				invalidateAll();
			};
		}}
	/>
</nav>
