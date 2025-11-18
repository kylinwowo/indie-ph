import { config } from 'dotenv';
config({ path: '.env.local' });

import { NewPost } from '@/lib/producthunt';
import { existPost, insertPost } from '@/models/post';
import { insertSyncLog } from '@/models/sync_logs';
import { filterIndieProducts, toNewPostRecord } from '@/utils/producthunt';

/**
 * Full sync script: fetch all ProductHunt posts and persist to DB.
 * Supports specifying postedAfter date and optional limit.
 *
 * Usage examples:
 *   tsx src/scripts/producthunt/full-sync.ts --date=2025-01-01
 *   tsx src/scripts/producthunt/full-sync.ts --date=2025-01-01 --limit=100
 */

function parseArgs(): { date: string; limit?: number } {
  const args = process.argv.slice(2);
  const dateArg = args.find((a) => a.startsWith('--date='));
  const limitArg = args.find((a) => a.startsWith('--limit='));

  if (!dateArg) {
    throw new Error('Missing required argument: --date=YYYY-MM-DD');
  }

  const dateInput = dateArg.split('=')[1];
  const ymdRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!ymdRegex.test(dateInput)) {
    throw new Error(
      'Invalid --date format. Expected YYYY-MM-DD (e.g., 2025-01-01)'
    );
  }
  // Convert to ISO start-of-day UTC
  const date = `${dateInput}T00:00:00Z`;
  const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;

  if (limit !== undefined && (!Number.isFinite(limit) || limit <= 0)) {
    throw new Error('Invalid --limit value, it must be a positive number');
  }

  return { date, limit };
}

async function main() {
  const startedAt = Date.now();
  const syncTime = new Date();
  const { date, limit } = parseArgs();

  const client = new NewPost(date);

  let totalFetched = 0;
  let newProducts = 0;
  let discardProducts = 0;
  let failedProducts = 0;

  console.log(`🚀 Full sync started. date=${date} limit=${limit ?? 'ALL'}`);

  try {
    while (true) {
      const batch = await client.get();
      if (!batch) break;

      totalFetched += batch.length;
      const filtered = filterIndieProducts(batch);
      discardProducts += batch.length - filtered.length;

      for (const p of filtered) {
        if (limit !== undefined && newProducts >= limit) {
          console.log('🔚 Limit reached, stopping ingestion.');
          break;
        }

        const productId = Number(p.id);
        const record = toNewPostRecord(p);
        if (await existPost(productId)) {
          continue;
        }
        try {
          const res = await insertPost(record);
          if (res) {
            newProducts += 1;
          } else {
            failedProducts += 1;
            console.warn('⚠️ Insert failed for post', productId);
          }
        } catch (err) {
          failedProducts += 1;
          console.error('❌ Insert failed for post', productId, err);
        }
      }

      if (limit !== undefined && newProducts >= limit) {
        break;
      }
    }

    const durationMs = Date.now() - startedAt;
    const status: 'success' | 'partial' | 'failed' =
      failedProducts > 0 ? 'partial' : 'success';

    const syncLog = {
      syncTime,
      status,
      durationMs,
      totalFetched,
      newProducts,
      updatedProducts: 0,
      discardProducts,
      failedProducts,
      errorMessage:
        failedProducts > 0 ? 'Some records failed to insert' : undefined,
      triggerSource: 'manual' as const,
    };

    await insertSyncLog(syncLog);

    console.log('✅ Full sync completed:', {
      status,
      durationMs,
      totalFetched,
      newProducts,
      discardProducts,
      failedProducts,
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    console.error('💥 Full sync failed:', error);

    try {
      await insertSyncLog({
        syncTime,
        status: 'failed',
        durationMs,
        totalFetched,
        newProducts,
        updatedProducts: 0,
        discardProducts,
        failedProducts: failedProducts + 1,
        errorMessage: error instanceof Error ? error.message : String(error),
        triggerSource: 'manual',
      });
    } catch (e) {
      console.error('🧾 Failed to write sync log:', e);
    }

    process.exit(1);
  }
}

main();
