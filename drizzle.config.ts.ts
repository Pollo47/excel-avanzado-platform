import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './db/schema',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://zvHSE7RKJmbVnLg.root:B5UFl9G8Dyer1nxx@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/iaacademy',
    ssl: {
      rejectUnauthorized: false, // Para TiDB Cloud puede ser false o true según tu entorno
    },
  },
} satisfies Config;