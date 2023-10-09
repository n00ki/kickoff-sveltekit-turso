import { sql } from 'drizzle-orm';
import { sqliteTable, text, blob, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		email: text('email').unique(),
		role: text('role', { enum: ['ADMIN', 'MEMBER'] })
			.notNull()
			.default('MEMBER'),
		avatar: text('avatar'),
		created_at: text('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updated_at: text('updated_at')
	},
	(users) => {
		return {
			email_idx: uniqueIndex('email_idx').on(users.email)
		};
	}
);

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	activeExpires: blob('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint'
	}).notNull()
});

export const keys = sqliteTable('keys', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => users.id),
	hashed_password: text('hashed_password')
});

export const tokens = sqliteTable(
	'tokens',
	{
		id: text('id').primaryKey(),
		user_id: text('user_id')
			.notNull()
			.references(() => users.id)
			.unique(),
		expires_at: blob('expires_at', {
			mode: 'bigint'
		}).notNull()
	},
	(tokens) => {
		return {
			user_id_idx: uniqueIndex('user_id_idx').on(tokens.user_id)
		};
	}
);
