<script lang="ts">
	// Utils
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { fade } from 'svelte/transition';

	// Stores
	import { page } from '$app/stores';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

	// Assets
	import { Loader2, XCircleIcon } from 'lucide-svelte';

	// Packages
	import toast from 'svelte-french-toast';

	export let data;

	const { form, errors, allErrors, message, constraints, enhance, delayed } = superForm(data.form, {
		autoFocusOnError: 'detect',
		invalidateAll: false,
		delayMs: 500,
		multipleSubmits: 'prevent',
		taintedMessage: 'Do you want to leave this page? Changes you made may not be saved.',
		syncFlashMessage: false,
		flashMessage: {
			module: flashModule
		},
		validationMethod: 'oninput',
		validators: {
			password: (value) => (value.length < 1 ? 'Password is required' : null),
			password_confirmation: (value) =>
				value.length < 1 ? 'Password confirmation is required' : null
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
	<p class="my-1 text-start">Enter a new password for <strong>{$page.data?.email}</strong></p>
	<form
		action="?/reset"
		method="POST"
		class="mx-auto flex w-full flex-col items-center justify-center"
		use:enhance
	>
		<input
			id="email"
			name="email"
			type="hidden"
			value={data.email ?? ''}
			class="hidden"
			required
			aria-hidden="true"
		/>

		<input
			id="token"
			name="token"
			type="hidden"
			value={data.token ?? ''}
			class="hidden"
			required
			aria-hidden="true"
		/>

		<div class="w-full flex-col items-start gap-2 py-1">
			<Label for="password">Password</Label>
			<Input
				type="password"
				id="password"
				name="password"
				bind:value={$form.password}
				{...$constraints.password}
			/>

			{#if $errors.password}
				<p in:fade class="py-2 text-sm text-error">{$errors.password}</p>
			{/if}
		</div>

		<div class="w-full flex-col items-start gap-2 py-1">
			<Label for="password">Password Confirmation</Label>
			<Input
				type="password"
				id="password_confirmation"
				name="password_confirmation"
				bind:value={$form.password_confirmation}
				{...$constraints.password_confirmation}
			/>

			{#if $errors.password_confirmation}
				<p in:fade class="py-2 text-sm text-error">{$errors.password_confirmation}</p>
			{/if}
		</div>

		<Button disabled={!!$delayed} variant="secondary" class="my-2 w-full">
			{#if !!$delayed}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Change Password
		</Button>

		{#if $message}
			<Alert.Root variant="destructive">
				<XCircleIcon class="h-6 w-6" />
				<Alert.Title>Oops...</Alert.Title>
				<Alert.Description>{$message}</Alert.Description>
			</Alert.Root>
		{/if}
	</form>
</FormWrapper>
