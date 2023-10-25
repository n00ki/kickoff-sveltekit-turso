import { redirect } from '@sveltejs/kit';

export const actions = {
  set: async ({ url, cookies }) => {
    const theme = url.searchParams.get('theme');
    const redirect_to = url.searchParams.get('redirect_to');

    if (theme) {
      cookies.set('theme', theme, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365
      });
    }

    throw redirect(303, redirect_to ?? '/');
  }
};
