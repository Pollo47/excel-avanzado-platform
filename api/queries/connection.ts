import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../db/schema';

let pool: mysql.Pool | null = null;

export function getDb() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('❌ La variable de entorno DATABASE_URL no está definida. Revisa tu archivo .env');
    }
    pool = mysql.createPool(url);
  }
  return drizzle(pool, { schema, mode: 'default' });
}