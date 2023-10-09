import type { NumericRange } from 'sveltekit-superforms/dist/utils';
import { fail } from '@sveltejs/kit';
import { setError, setMessage } from 'sveltekit-superforms/server';

export const form_fail = (
	form: any,
	remove_sensitive_data?: string[],
	status?: NumericRange<400, 599>
) => {
	if (!form) return;
	if (remove_sensitive_data) {
		for (const field of remove_sensitive_data) {
			if (form.data[field]) {
				form.data[field] = '';
			}
		}
	}
	return fail(status ?? 400, { form });
};

export const set_form_error = (
	form: any,
	text: string,
	opts?: { status?: NumericRange<400, 599>; field?: string; remove_sensitive_data?: string[] }
) => {
	if (!form) return;

	if (opts?.remove_sensitive_data) {
		for (const field of opts.remove_sensitive_data) {
			if (form.data[field]) {
				form.data[field] = '';
			}
		}
	}

	if (opts?.field) return setError(form, opts?.field, text, { status: opts?.status ?? 400 });
	return setMessage(form, text, { status: opts?.status ?? 400 });
};
