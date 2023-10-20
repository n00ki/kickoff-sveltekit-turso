// Types
import type { Action } from './$types';

// Env Variables
import { PUBLIC_BASE_URL } from '$env/static/public';

// Utils
import db from '$lib/server/database';
import { auth } from '$lib/server/auth';
import { users, tokens } from '$lib/db/models/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate as validate_form } from 'sveltekit-superforms/server';
import { request_password_reset_schema } from '$lib/validations/auth';
import { form_fail, set_form_error } from '$lib/utils/helpers/forms';
import { send_email } from '$lib/utils/mail/mailer';
import { generateRandomString } from 'lucia/utils';

export async function load({ locals }) {
	// redirect user if already logged in
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');

	const form = await validate_form(request_password_reset_schema);

	return {
		metadata: {
			title: 'Reset Password'
		},
		form
	};
}

const request_reset: Action = async (event) => {
	const form = await validate_form(event.request, request_password_reset_schema);

	if (!form.valid) {
		return form_fail(form);
	}

	const { email } = form.data;

	const get_users = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
	const user = get_users[0];

	if (!user) {
		// we send a success message even if the user doesn't exist to prevent email enumeration
		throw redirect(
			'/',
			{
				type: 'success',
				message: 'An email has been sent to reset your password!'
			},
			event
		);
	}

	try {
		const timestamp = BigInt(new Date(Date.now() + 1000 * 60 * 10).getTime());
		const create_or_update_tokens = await db
			.insert(tokens)
			.values({
				id: generateRandomString(15),
				user_id: user.id,
				expires_at: timestamp
			})
			.onConflictDoUpdate({
				target: tokens.user_id,
				set: { expires_at: timestamp }
			})
			.returning();

		console.log(create_or_update_tokens);

		const token = create_or_update_tokens[0];

		await auth.invalidateAllUserSessions(user.id);

		const url = new URL(`${PUBLIC_BASE_URL}/reset-password/${email}/${token?.id}`);
		await send_email(email, 'Reset Password', 'ResetPassword', { url: url });
	} catch (error) {
		console.log(error);
		return set_form_error(form, 'Something went wrong. Please try again later.', { status: 500 });
	}

	throw redirect(
		'/',
		{
			type: 'success',
			message: 'An email has been sent to reset your password!'
		},
		event
	);
};

export const actions = { request_reset };
