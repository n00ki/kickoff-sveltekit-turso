<script lang="ts">
	import { fly } from 'svelte/transition';
	import * as Alert from '$lib/components/ui/alert';
	import { CheckCircle2Icon, AlertTriangleIcon, XCircleIcon } from 'lucide-svelte';

	export let type: 'success' | 'error' | 'warning';
	export let message: string;
</script>

<div transition:fly={{ y: 200, delay: 100, duration: 1000 }}>
	<Alert.Root variant={type === 'error' ? 'destructive' : 'default'} class="m-0 rounded-none">
		{#if type === 'success'}
			<CheckCircle2Icon class="h-6 w-6" />
		{:else if type === 'error'}
			<XCircleIcon class="h-6 w-6" />
		{:else if type === 'warning'}
			<AlertTriangleIcon class="h-6 w-6" />
		{/if}
		<Alert.Title>{`${type.toUpperCase()}!`}</Alert.Title>
		<Alert.Description>{message}</Alert.Description>
	</Alert.Root>
</div>
