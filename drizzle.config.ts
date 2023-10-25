import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/lib/db/models/*',
  out: './src/lib/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN || ''
  }
} satisfies Config;
