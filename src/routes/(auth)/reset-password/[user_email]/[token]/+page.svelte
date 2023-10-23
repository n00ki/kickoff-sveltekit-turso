<script lang="ts">
	// Utils
	import type { FormOptions } from 'formsnap';
	import { reset_password_schema } from '$lib/validations/auth.js';
	import * as flashModule from 'sveltekit-flash-message/client';

	// Stores
	import { page } from '$app/stores';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import * as Form from '$lib/components/ui/form';

	// Assets
	import { Reload } from 'radix-icons-svelte';

	export let data;

	const options: FormOptions<typeof reset_password_schema> = {
		validators: reset_password_schema,
		delayMs: 500,
		multipleSubmits: 'prevent',
		syncFlashMessage: false,
		flashMessage: {
			module: flashModule
		}
	};
</script>

<FormWrapper>
	<p class="my-1 text-start">Enter a new password for <strong>{$page.data?.email}</strong></p>
	<Form.Root
		method="POST"
		action="?/reset"
		form={data.form}
		schema={reset_password_schema}
		{options}
		let:config
		let:delayed
	>
		<Form.Field name="email" {config}>
			<Form.Input type="hidden" value={data?.email ?? ''} aria-hidden="true" required />
		</Form.Field>

		<Form.Field name="token" {config}>
			<Form.Input type="hidden" value={data?.token ?? ''} aria-hidden="true" required />
		</Form.Field>

		<Form.Field name="password" {config} let:constraints>
			<Form.Label>Password</Form.Label>
			<Form.Input type="password" {...constraints} />
			<Form.Validation />
		</Form.Field>

		<Form.Field name="password_confirmation" {config} let:constraints>
			<Form.Label>Password Confirmation</Form.Label>
			<Form.Input type="password" {...constraints} />
			<Form.Validation />
		</Form.Field>

		<Form.Button disabled={delayed} variant="secondary" class="my-2 w-full">
			{#if delayed}
				<Reload class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Update Password
		</Form.Button>
	</Form.Root>
</FormWrapper>
