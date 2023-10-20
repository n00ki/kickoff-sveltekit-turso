// Types
import type { Action } from './$types';

// Utils
import db from '$lib/server/database';
import { tokens } from '$lib/db/models/auth';
import { eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate as validate_form } from 'sveltekit-superforms/server';
import { reset_password_schema } from '$lib/validations/auth';
import { form_fail, set_form_error } from '$lib/utils/helpers/forms';

export async function load({ locals, params }) {
	// redirect user if already logged in
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	const email_param: string | null = params.user_email || null;
	const token_param: string | null = params.token || null;

	if (email_param && token_param) {
		try {
			const get_tokens = await db
				.select({ user_id: tokens.user_id, expires_at: tokens.expires_at })
				.from(tokens)
				.where(eq(tokens.id, token_param));

			const token = get_tokens[0];
			console.log(token);
			if (!token) {
				throw error(400, 'Invalid Token');
			}

			if (token.expires_at < new Date(Date.now()).getTime()) {
				throw error(400, 'Expired Token');
			}
		} catch (e: any) {
			throw error(e.status, e.body.message);
		}
	} else {
		throw redirect(302, '/reset-password');
	}

	const form = await validate_form(reset_password_schema);

	return {
		metadata: {
			title: 'Reset Password'
		},
		email: email_param,
		token: token_param,
		form
	};
}

const reset: Action = async (event) => {
	const form = await validate_form(event.request, reset_password_schema);

	if (!form.valid) {
		return form_fail(form, { remove_sensitive_data: ['password', 'password_confirmation'] });
	} else {
		const { email, token, password, password_confirmation } = form.data;

		if (password !== password_confirmation) {
			return set_form_error(
				form,
				'Passswords do not match',
				{
					status: 400,
					field: 'password_confirmation'
				},
				event
			);
		}
		try {
			await auth.updateKeyPassword('email', email, password);
		} catch (error) {
			return set_form_error(
				form,
				'Something went wrong. Please try again later.',
				{
					status: 500,
					remove_sensitive_data: ['password', 'password_confirmation']
				},
				event
			);
		}

		await db.delete(tokens).where(eq(tokens.id, token));
	}

	throw redirect(
		'/login',
		{
			type: 'success',
			message: 'Password was reset successfully. You can now login.'
		},
		event
	);
};

export const actions = { reset };
