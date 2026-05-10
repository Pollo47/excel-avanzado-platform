import { mysqlTable, int, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const accessKeys = mysqlTable('access_keys', {
  id: int('id').primaryKey().autoincrement(),
  keyCode: varchar('key_code', { length: 8 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull().default('individual'),
  email: varchar('email', { length: 255 }),
  institutionName: varchar('institution_name', { length: 255 }),
  groupName: varchar('group_name', { length: 255 }),
  used: boolean('used').default(false).notNull(),
  usedByUserId: int('used_by_user_id').references(() => users.id),
  createdByAdminId: int('created_by_admin_id').references(() => users.id),
});

export type AccessKey = typeof accessKeys.$inferSelect;
export type NewAccessKey = typeof accessKeys.$inferInsert;