<script lang="ts">
	// Utils
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { fade } from 'svelte/transition';

	// Packages
	import toast from 'svelte-french-toast';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';

	// Assets
	import { Update, CrossCircled } from 'radix-icons-svelte';

	export let data;

	const { form, errors, allErrors, message, constraints, enhance, delayed } = superForm(data.form, {
		autoFocusOnError: 'detect',
		delayMs: 500,
		multipleSubmits: 'prevent',
		taintedMessage: 'Do you want to leave this page? Changes you made may not be saved.',
		syncFlashMessage: false,
		flashMessage: {
			module: flashModule
		},
		validationMethod: 'oninput',
		validators: {
			email: (value) => (value.length < 1 ? 'Email is required.' : null),
			password: (value) =>
				value.length < 6 ? 'Password must be at least 6 characters long.' : null,
			password_confirmation: (value) =>
				value.length < 1 ? 'Password confirmation is required.' : null
		},
		onUpdated: async ({ form }) => {
			if (!form.valid) {
				if ($message) toast.error($message);
				if ($allErrors) {
					const errors = $allErrors.map((errors) => errors.messages).flat();
					errors.forEach((message) => toast.error(message));
				}
				document.getElementById('email')?.focus();
			}
		}
	});
</script>

<FormWrapper>
	<form
		action="?/register"
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
				<Update class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Register
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
