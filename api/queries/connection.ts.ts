@'
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../db/schema';

let pool: mysql.Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL!);
  }
  return drizzle(pool, { schema, mode: 'default' });
}
'@ | Out-File -FilePath api/queries/connection.ts -Encoding utf8