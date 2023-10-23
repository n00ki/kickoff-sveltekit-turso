<script lang="ts">
	// Utils
	import type { FormOptions } from 'formsnap';
	import { registration_schema } from '$lib/validations/auth';
	import * as flashModule from 'sveltekit-flash-message/client';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import * as Form from '$lib/components/ui/form';

	// Assets
	import { Reload } from 'radix-icons-svelte';

	export let data;

	const options: FormOptions<typeof registration_schema> = {
		validators: registration_schema,
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
		action="?/register"
		form={data.form}
		schema={registration_schema}
		{options}
		let:config
		let:delayed
	>
		<Form.Field name="email" {config} let:constraints>
			<Form.Label>Email</Form.Label>
			<Form.Input type="email" autocapitalize="none" autocorrect="off" {...constraints} />
			<Form.Validation />
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
			Register
		</Form.Button>
	</Form.Root>
</FormWrapper>
