<script lang="ts">
	import { js_enabled } from '$lib/stores/js_status';

	let dropdown_state = false;

	export let type: 'text' | 'avatar' = 'text';

	const handle_dropdown_state = () => {
		dropdown_state = !dropdown_state;
	};

	const handle_dropdown_focus_lost = ({ relatedTarget, currentTarget }: FocusEvent) => {
		// use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (
			relatedTarget instanceof HTMLElement &&
			(currentTarget as HTMLDivElement).contains(relatedTarget)
		)
			return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		dropdown_state = false;
	};
</script>

<div on:focusout={handle_dropdown_focus_lost} role="menu" class="dropdown-end dropdown">
	<span
		role="button"
		on:click={handle_dropdown_state}
		on:keydown={(e) => {
			if (e.key === 'Enter') handle_dropdown_state();
		}}
		tabindex="0"
		aria-haspopup="true"
		aria-expanded={dropdown_state}
		class="btn-ghost btn mx-1 focus:bg-neutral {type === 'avatar' && 'btn-circle avatar'}"
	>
		<slot name="trigger" />
	</span>

	{#if $js_enabled && dropdown_state}
		<ul
			id="menu-dropdown"
			class="dropdown-content menu rounded-box mt-4 w-52 bg-base-200 p-2 shadow-md"
		>
			<slot name="items" />
		</ul>
	{/if}
</div>
