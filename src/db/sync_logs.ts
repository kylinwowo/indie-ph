import {
  pgTable,
  serial,
  integer,
  timestamp,
  text,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums for sync logs
export const syncStatusEnum = pgEnum('sync_status', [
  'success',
  'failed',
  'partial',
]);

export const triggerSourceEnum = pgEnum('trigger_source', [
  'manual',
  'cron',
  'api',
]);

// Sync logs table schema
export const syncLogs = pgTable(
  'sync_logs',
  {
    id: serial('id').primaryKey(),
    syncTime: timestamp('sync_time').notNull(),
    status: syncStatusEnum('status').notNull(),
    durationMs: integer('duration_ms'),
    totalFetched: integer('total_fetched').default(0).notNull(),
    newProducts: integer('new_products').default(0).notNull(),
    updatedProducts: integer('updated_products').default(0).notNull(),
    discardProducts: integer('discard_products').default(0).notNull(),
    failedProducts: integer('failed_products').default(0).notNull(),
    errorMessage: text('error_message'),
    triggerSource: triggerSourceEnum('trigger_source').default('api').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    syncLogsSyncTimeIdx: index('sync_logs_sync_time_idx').on(table.syncTime),
    syncLogsStatusIdx: index('sync_logs_status_idx').on(table.status),
    syncLogsCreatedAtIdx: index('sync_logs_created_at_idx').on(table.createdAt),
  })
);

// Validate sync log insert schema
export const insertSyncLogSchema = createInsertSchema(syncLogs, {
  syncTime: z.date(),
  status: z.enum(['success', 'failed', 'partial']),
  durationMs: z.number().positive().optional(),
  totalFetched: z.number().min(0),
  newProducts: z.number().min(0),
  updatedProducts: z.number().min(0),
  discardProducts: z.number().min(0),
  failedProducts: z.number().min(0),
  errorMessage: z.string().optional(),
  triggerSource: z.enum(['manual', 'cron', 'api']),
});

// Export types
export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
