import { TURSO_DATABASE_URL, TURSO_DATABASE_AUTH_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export const client = createClient({
	url: TURSO_DATABASE_URL,
	authToken: TURSO_DATABASE_AUTH_TOKEN
});

const db = drizzle(client);
export default db;
