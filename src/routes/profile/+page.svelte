<script lang="ts">
	// Env Variables
	import { PUBLIC_AWS_S3_BUCKET_URL } from '$env/static/public';

	// Utils
	import type { FormOptions } from 'formsnap';
	import { edit_account_validation_schema } from '$lib/validations/auth.js';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { error } from '@sveltejs/kit';
	import { validate_avatar_file } from '$lib/validations/files.js';
	import { fade } from 'svelte/transition';
	import toast from 'svelte-french-toast';

	// Components
	import FormWrapper from '$components/FormWrapper.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Alert from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';

	// Assets
	import avatar_placeholder from '$lib/assets/avatar.png';
	import { Reload, CrossCircled } from 'radix-icons-svelte';

	export let data;

	let file_upload_status: 'ready' | 'uploading' | 'uploaded' | 'failed' = 'ready';
	let file_upload_progress: number = 0;
	let file_upload_errors: string[] = [];
	let avatar_file_id: string | null = null;
	let avatar_preview_url: string | null = null;

	const options: FormOptions<typeof edit_account_validation_schema> = {
		validators: edit_account_validation_schema,
		autoFocusOnError: 'detect',
		invalidateAll: true,
		delayMs: 500,
		multipleSubmits: 'prevent',
		syncFlashMessage: false,
		flashMessage: {
			module: flashModule
		},
		resetForm: true,
		onSubmit: async ({ formData, cancel }) => {
			if (avatar_file_id) {
				formData.set('avatar', avatar_file_id as string);
			} else {
				formData.delete('avatar');
			}

			// prevent a request if the form is empty
			if (!avatar_file_id) {
				cancel();
				toast.error('No changes were made');
			}
		}
	};

	const upload_avatar = async (event: Event) => {
		file_upload_status = 'ready';

		try {
			const avatar_input_field: HTMLInputElement = event.target as HTMLInputElement;
			if (!avatar_input_field.files) return;
			const avatar_file = avatar_input_field.files[0];

			const { valid, errors } = validate_avatar_file(avatar_file);
			if (!valid) {
				file_upload_status = 'failed';
				file_upload_errors = errors;
				toast.error(file_upload_errors[0]);
				return;
			}

			const get_presigned_url = await fetch('/api/upload', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					file_type: avatar_file.type,
					destination_directory: 'avatars'
				})
			});

			const { file_name, presigned_url } = await get_presigned_url.json();

			// const upload_to_s3 = await fetch(presigned_url, {
			// 	method: 'PUT',
			// 	headers: {
			// 		'Content-type': avatar_file.type
			// 	},
			// 	body: avatar_file
			// });

			const xhr = new XMLHttpRequest();

			xhr.upload.onloadstart = () => {
				file_upload_status = 'uploading';
			};

			xhr.upload.onprogress = (e) => {
				if (e.lengthComputable) {
					file_upload_progress = Math.round((e.loaded / e.total) * 100);
				}
			};

			xhr.open('PUT', presigned_url, true);
			xhr.setRequestHeader('Content-Type', avatar_file.type);
			xhr.send(avatar_file);

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						console.log('success');
						avatar_preview_url = `${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${file_name}`;
						file_upload_status = 'uploaded';
						file_upload_progress = 0;
					} else {
						console.log('failure');
						file_upload_status = 'failed';
						file_upload_errors = ['Error uploading avatar'];
						file_upload_progress = 0;
						toast.error('Error uploading avatar');
						throw error(500, 'Error uploading avatar');
					}
				}
			};

			avatar_file_id = file_name ?? '';
		} catch (err) {
			file_upload_status = 'failed';
			file_upload_errors = ['Error uploading avatar'];
			file_upload_progress = 0;
			toast.error('Error uploading avatar');
			throw error(500, 'Error uploading avatar');
		}
	};

	$: user_avatar = data.user?.avatar
		? `${PUBLIC_AWS_S3_BUCKET_URL}/avatars/${data.user.avatar}`
		: avatar_placeholder;
</script>

<div class="grid flex-1 content-center">
	<FormWrapper>
		<h3 class="self-start text-lg font-semibold uppercase">User Settings</h3>
		<div
			id="avatar-preview"
			class="flex shrink-0 items-center justify-center p-2 {file_upload_status === 'uploading'
				? 'loading loading-infinity loading-lg text-primary'
				: ''}}"
		>
			<img
				src={avatar_preview_url ?? user_avatar}
				alt="avatar preview"
				class="h-32 w-32 rounded-full object-cover"
			/>
		</div>

		<Form.Root
			method="POST"
			action="?/edit_account"
			form={data.form}
			schema={edit_account_validation_schema}
			enctype="multipart/form-data"
			{options}
			let:config
			let:delayed
		>
			<Form.Field name="avatar" {config} let:constraints>
				<Form.Label>Avatar</Form.Label>
				<Form.Input
					type="file"
					on:change={upload_avatar}
					disabled={file_upload_status === 'uploading'}
					{...constraints}
				/>
				<Form.Validation />
			</Form.Field>

			{#if file_upload_status === 'uploading'}
				<div class="w-full py-2">
					<progress
						transition:fade
						class="h-2 w-full overflow-hidden rounded-full bg-primary/20"
						value={file_upload_progress}
						max="100"
						aria-label="avatar upload progress"
					/>
				</div>
			{/if}

			<Form.Button disabled={delayed} variant="secondary" class="my-2 w-full">
				{#if delayed}
					<Reload class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Update
			</Form.Button>
		</Form.Root>

		{#if file_upload_status === 'failed'}
			{#each file_upload_errors as error}
				<Alert.Root variant="destructive" class="inline-flex items-center gap-2">
					<div>
						<CrossCircled class="h-6 w-6" />
					</div>
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/each}
		{/if}

		<div class="my-2">
			<Separator />
		</div>

		<AlertDialog.Root>
			<AlertDialog.Trigger class="w-full">
				<Button variant="destructive" class="my-2 w-full">Delete Account</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Back to safety</AlertDialog.Cancel>
					<AlertDialog.Action
						class="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
					>
						<form
							id="delete_account"
							action="?/delete_account"
							method="POST"
							class="mx-auto flex w-full flex-col items-center justify-center"
						>
							<button type="submit">Continue</button>
						</form>
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</FormWrapper>
</div>

<style>
	progress::-webkit-progress-value {
		background-color: #1e293b;
	}
</style>
