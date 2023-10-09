// Packages
import { lucia } from 'lucia';

// Utils
import { client } from '$lib/server/database';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { sveltekit } from 'lucia/middleware';

// Stores
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: libsql(client, {
		user: 'users',
		key: 'keys',
		session: 'sessions'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			email: data.email,
			avatar: data.avatar
		};
	},
	csrfProtection: true,
	sessionCookie: {
		name: '__auth_session',
		attributes: {
			sameSite: 'strict'
		}
	}
});

export type Auth = typeof auth;
