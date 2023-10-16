<script lang="ts">
	// Utils
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { fade } from 'svelte/transition';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

	// Assets
	import { Update, CrossCircled } from 'radix-icons-svelte';

	// Packages
	import toast from 'svelte-french-toast';

	export let data;

	const { form, errors, allErrors, message, constraints, enhance, delayed } = superForm(data.form, {
		autoFocusOnError: 'detect',
		invalidateAll: true,
		delayMs: 500,
		multipleSubmits: 'prevent',
		taintedMessage: 'Do you want to leave this page? Changes you made may not be saved.',
		syncFlashMessage: false,
		flashMessage: {
			module: flashModule
		},
		validationMethod: 'oninput',
		validators: {
			email: (value) => (value.length < 1 ? 'Email is required' : null)
		},
		onUpdated: async ({ form }) => {
			if (!form.valid) {
				if ($message) toast.error($message);
				if ($allErrors) {
					const errors = $allErrors.map((errors) => errors.messages).flat();
					errors.forEach((message) => toast.error(message));
				}
			}
		}
	});
</script>

<FormWrapper>
	<form
		action="?/request_reset"
		method="POST"
		class="mx-auto flex w-full flex-col items-center justify-center"
		use:enhance
	>
		<div class="w-full flex-col items-start gap-2 py-1">
			<Label for="email">Email</Label>
			<Input
				type="email"
				id="email"
				name="email"
				autocapitalize="none"
				autocorrect="off"
				bind:value={$form.email}
				{...$constraints.email}
			/>

			{#if $errors.email}
				<p in:fade class="py-2 text-sm text-error">{$errors.email}</p>
			{/if}
		</div>

		<Button disabled={!!$delayed} variant="secondary" class="my-2 w-full">
			{#if !!$delayed}
				<Update class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Reset Your Password
		</Button>

		{#if $message}
			<Alert.Root variant="destructive">
				<CrossCircled class="h-6 w-6" />
				<Alert.Title>Oops...</Alert.Title>
				<Alert.Description>{$message}</Alert.Description>
			</Alert.Root>
		{/if}
	</form>
</FormWrapper>
