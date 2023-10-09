// Types
import type { Action } from './$types.js';

// Utils
import db from '$lib/server/database';
import { auth } from '$lib/server/auth';
import { users } from '$lib/db/models/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate as validate_form } from 'sveltekit-superforms/server';
import { registration_schema } from '$lib/utils/validations/auth';
import { form_fail, set_form_error } from '$lib/utils/helpers/forms';
import { send_email } from '$lib/utils/mail/mailer';

export async function load({ locals }) {
	// redirect to `/` if logged in
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	const form = await validate_form(registration_schema);

	return {
		metadata: {
			title: 'Register'
		},
		form
	};
}

const register: Action = async (event) => {
	const form = await validate_form(event.request, registration_schema);

	if (!form.valid) {
		return form_fail(form, ['password', 'password_confirmation']);
	} else {
		const { email, password, password_confirmation } = form.data;

		if (password !== password_confirmation) {
			return set_form_error(form, 'Passwords do not match.', {
				field: 'password_confirmation',
				remove_sensitive_data: ['password', 'password_confirmation']
			});
		}

		const get_users = await db.select().from(users).where(eq(users.email, email));
		const user = get_users[0];

		if (user) {
			return set_form_error(form, 'Email is already taken.', {
				field: 'email',
				remove_sensitive_data: ['password', 'password_confirmation']
			});
		}

		try {
			await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					email
				}
			});

			// Automatically log in the user
			try {
				const key = await auth.useKey('email', email.toLowerCase(), password);
				const session = await auth.createSession({
					userId: key.userId,
					attributes: {}
				});
				event.locals.auth.setSession(session);
			} catch (e: any) {
				console.log(e);
			}

			send_email(email, 'Welcome to SvelteKit!', 'Welcome');
		} catch (e: any) {
			console.log(e);

			return set_form_error(form, 'Something went wrong. Please try again later.', {
				status: 500,
				remove_sensitive_data: ['password', 'password_confirmation']
			});
		}

		throw redirect(
			'/login',
			{
				type: 'success',
				message: 'Registered successfully.'
			},
			event
		);
	}
};

export const actions = { register };
