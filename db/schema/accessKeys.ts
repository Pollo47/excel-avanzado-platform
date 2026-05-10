@'
import { mysqlTable, int, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const accessKeys = mysqlTable('access_keys', {
  id: int('id').primaryKey().autoincrement(),
  keyCode: varchar('key_code', { length: 8 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull().default('individual'),
  entityName: varchar('entity_name', { length: 255 }).notNull(),
  emailDomain: varchar('email_domain', { length: 255 }),
  used: boolean('used').default(false).notNull(),
  usedByUserId: int('used_by_user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

export type AccessKey = typeof accessKeys.$inferSelect;
export type NewAccessKey = typeof accessKeys.$inferInsert;
'@ | Out-File -FilePath db/schema/accessKeys.ts -Encoding utf8