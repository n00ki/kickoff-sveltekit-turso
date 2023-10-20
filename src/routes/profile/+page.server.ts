// Utils
import { type Action, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { superValidate as validate_form } from 'sveltekit-superforms/server';
import { edit_account_validation_schema } from '$lib/validations/auth';
import { set_form_error } from '$lib/utils/helpers/forms';
import { redirect } from 'sveltekit-flash-message/server';

export async function load({ locals }) {
	// redirect to `/` if logged in
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/');

	const form = validate_form(edit_account_validation_schema);

	return {
		metadata: {
			title: 'Profile'
		},
		form
	};
}

const edit_account: Action = async (event) => {
	const form = await validate_form(event.request, edit_account_validation_schema);

	if (!form.valid) {
		return fail(400, { form });
	} else {
		const session = await event.locals.auth.validate();
		const user = session && session.user;

		if (!user) {
			throw redirect(
				{
					type: 'error',
					message: 'You are not logged in'
				},
				event
			);
		}

		const { avatar } = form.data;

		if (!avatar) {
			throw redirect(
				{
					type: 'warning',
					message: 'No changes were made. Nothing to update.'
				},
				event
			);
		}

		console.log(user, avatar);

		if (avatar && typeof avatar === 'string') {
			try {
				await auth.updateUserAttributes(user.userId, {
					avatar: avatar
				});
			} catch (error) {
				console.log(error);
				return set_form_error(form, 'Something went wrong. Please try again later.', {
					status: 500,
					field: 'avatar'
				});
			}
		}

		throw redirect({ type: 'success', message: 'Account updated' }, event);
	}
};

const delete_account: Action = async (event) => {
	const session = await event.locals.auth.validate();
	const user = session && session.user;

	console.log(session, user);

	try {
		auth.deleteUser(user.userId); // delete user
	} catch {
		throw redirect(
			{
				type: 'error',
				message: 'Something went wrong. Please try again later.'
			},
			event
		);
	}

	if (session) {
		await auth.invalidateSession(session.sessionId); // invalidate session
	}
	event.locals.auth.setSession(null); // remove cookie

	throw redirect('/', { type: 'success', message: 'Account deleted.' }, event);
};

export const actions = { edit_account, delete_account };
