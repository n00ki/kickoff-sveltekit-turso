<script lang="ts">
	// Utils
	import type { FormOptions } from 'formsnap';
	import { login_schema } from '$lib/validations/auth';
	import * as flashModule from 'sveltekit-flash-message/client';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import * as Form from '$lib/components/ui/form';

	// Assets
	import { Reload } from 'radix-icons-svelte';

	export let data;

	const options: FormOptions<typeof login_schema> = {
		validators: login_schema,
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
		action="?/login"
		form={data.form}
		schema={login_schema}
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

		<Form.Button disabled={delayed} variant="secondary" class="my-2 w-full">
			{#if delayed}
				<Reload class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Sign In
		</Form.Button>

		<div class="mt-2 flex w-full justify-between">
			<a href="/reset-password" class="text-sm">Forgot your password?</a>
			<a href="/register" class="text-sm">Doesn't have an account yet?</a>
		</div>
	</Form.Root>
</FormWrapper>
