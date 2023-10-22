import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { themes } from '$lib/utils/themes';

Sentry.init({
    dsn: "https://c9f1f22595a4d1c9fb1619ae0a381e8b@o506308.ingest.sentry.io/4506094328283136",
    tracesSampleRate: 1
})

export const handle_auth: Handle = async ({ event, resolve }) => {
				event.locals.auth = auth.handleRequest(event);
				return await resolve(event);
};
const handle_theme: Handle = async ({ event, resolve }) => {
				const theme = event.cookies.get('theme') ?? themes.default;
				event.locals.theme = theme;

				return await resolve(event, {
								transformPageChunk: ({ html }) => html.replace('%theme%', String(theme))
				});
};

export const handle: Handle = sequence(Sentry.sentryHandle(), sequence(handle_auth, handle_theme));
export const handleError = Sentry.handleErrorWithSentry();