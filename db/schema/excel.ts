@'
import { mysqlTable, int, varchar, text, boolean, timestamp, json, index } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const excelModules = mysqlTable('excel_modules', {
  id: int('id').primaryKey().autoincrement(),
  order: int('order').notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  coverImage: varchar('cover_image', { length: 512 }).notNull(),
  durationHours: int('duration_hours').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const excelUnits = mysqlTable('excel_units', {
  id: int('id').primaryKey().autoincrement(),
  moduleId: int('module_id').notNull().references(() => excelModules.id, { onDelete: 'cascade' }),
  order: int('order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const excelParagraphs = mysqlTable('excel_paragraphs', {
  id: int('id').primaryKey().autoincrement(),
  unitId: int('unit_id').notNull().references(() => excelUnits.id, { onDelete: 'cascade' }),
  order: int('order').notNull(),
  content: text('content').notNull(),
  imageUrl: varchar('image_url', { length: 512 }),
  imageCaption: varchar('image_caption', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const excelExercises = mysqlTable('excel_exercises', {
  id: int('id').primaryKey().autoincrement(),
  unitId: int('unit_id').notNull().references(() => excelUnits.id, { onDelete: 'cascade' }),
  order: int('order').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  solutionHint: text('solution_hint'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const excelQuizQuestions = mysqlTable('excel_quiz_questions', {
  id: int('id').primaryKey().autoincrement(),
  unitId: int('unit_id').notNull().references(() => excelUnits.id, { onDelete: 'cascade' }),
  order: int('order').notNull(),
  questionText: text('question_text').notNull(),
  options: json('options').$type<string[]>().notNull(),
  correctAnswer: int('correct_answer').notNull(),
  explanation: text('explanation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const excelUserProgress = mysqlTable('excel_user_progress', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  moduleId: int('module_id').notNull().references(() => excelModules.id, { onDelete: 'cascade' }),
  percentage: int('percentage').default(0).notNull(),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userModuleUnique: index('user_module_unique').on(table.userId, table.moduleId),
}));

export const excelAccessRequests = mysqlTable('excel_access_requests', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
  notes: text('notes'),
});
'@ | Out-File -FilePath db/schema/excel.ts -Encoding utf8
}));