import { db, syncLogs } from '@/db';
import { insertSyncLogSchema, type NewSyncLog } from '@/db/sync_logs';

export async function insertSyncLog(log: NewSyncLog): Promise<void> {
  const validated = insertSyncLogSchema.parse(log);
  await db.insert(syncLogs).values(validated);
}
