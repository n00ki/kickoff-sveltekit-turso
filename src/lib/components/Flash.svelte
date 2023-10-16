<script lang="ts">
	import { fade } from 'svelte/transition';
	import * as Alert from '$lib/components/ui/alert';
	import { CheckCircled, ExclamationTriangle, CrossCircled } from 'radix-icons-svelte';

	export let type: 'success' | 'error' | 'warning';
	export let message: string;
</script>

<div transition:fade={{ delay: 100 }}>
	<Alert.Root variant={type === 'error' ? 'destructive' : 'default'} class="m-0 rounded-none">
		{#if type === 'success'}
			<CheckCircled class="h-6 w-6" />
		{:else if type === 'error'}
			<CrossCircled class="h-6 w-6" />
		{:else if type === 'warning'}
			<ExclamationTriangle class="h-6 w-6" />
		{/if}
		<Alert.Title>{`${type.toUpperCase()}!`}</Alert.Title>
		<Alert.Description>{message}</Alert.Description>
	</Alert.Root>
</div>
