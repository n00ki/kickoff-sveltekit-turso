<script lang="ts">
	// Utils
	import type { FormOptions } from 'formsnap';
	import { request_password_reset_schema } from '$lib/validations/auth';
	import * as flashModule from 'sveltekit-flash-message/client';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import * as Form from '$lib/components/ui/form';

	// Assets
	import { Reload } from 'radix-icons-svelte';

	export let data;

	const options: FormOptions<typeof request_password_reset_schema> = {
		validators: request_password_reset_schema,
		autoFocusOnError: 'detect',
		invalidateAll: true,
		delayMs: 500,
		multipleSubmits: 'prevent',
		syncFlashMessage: false,
		flashMessage: {
			module: flashModule
		}
	};
</script>

<FormWrapper>
	<Form.Root
		method="POST"
		action="?/request_reset"
		form={data.form}
		schema={request_password_reset_schema}
		{options}
		let:config
		let:delayed
	>
		<Form.Field name="email" {config} let:constraints>
			<Form.Label>Email</Form.Label>
			<Form.Input type="email" autocapitalize="none" autocorrect="off" {...constraints} />
			<Form.Description>We will send you a password reset link</Form.Description>
			<Form.Validation />
		</Form.Field>

		<Form.Button disabled={delayed} variant="secondary" class="my-2 w-full">
			{#if delayed}
				<Reload class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Send
		</Form.Button>
	</Form.Root>
</FormWrapper>
