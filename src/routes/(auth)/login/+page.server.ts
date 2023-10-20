// Types
import type { Action, Actions } from './$types';

// Utils
import { auth } from '$lib/server/auth';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate as validate_form } from 'sveltekit-superforms/server';
import { login_schema } from '$lib/validations/auth';
import { form_fail, set_form_error } from '$lib/utils/helpers/forms';
import { LuciaError } from 'lucia';

export async function load({ locals }) {
	// redirect to `/` if logged in
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	const form = await validate_form(login_schema);

	return {
		metadata: {
			title: 'Login'
		},
		form
	};
}

const login: Action = async (event) => {
	const form = await validate_form(event.request, login_schema);

	if (!form.valid) {
		return form_fail(form, { remove_sensitive_data: ['password'] });
	} else {
		const { password, email } = form.data;

		try {
			const key = await auth.useKey('email', email.toLowerCase(), password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
		} catch (e: any) {
			console.log(e);
			if (
				(e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') ||
				e.message === 'AUTH_INVALID_PASSWORD'
			) {
				return set_form_error(
					form,
					'Incorrect email or password',
					{
						status: 401,
						remove_sensitive_data: ['password']
					},
					event
				);
			}

			return set_form_error(
				form,
				'Something went wrong. Please try again later.',
				{
					status: 500,
					remove_sensitive_data: ['password']
				},
				event
			);
		}
	}

	throw redirect(
		'/',
		{
			type: 'success',
			message: 'Logged in successfully'
		},
		event
	);
};

export const actions: Actions = { login };
