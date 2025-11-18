import { NextRequest, NextResponse } from 'next/server';
import { NewPost } from '@/lib/producthunt';
import { existPost, insertPost, getPostsPage } from '@/models/post';
import { insertSyncLog } from '@/models/sync_logs';
import { filterIndieProducts, toNewPostRecord } from '@/utils/producthunt';

// GET /api/sync/incremental
// Auth: Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const syncTime = new Date();

  // Bearer token auth
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { status: 'error', error: { message: 'Unauthorized' } },
      { status: 401 }
    );
  }

  const triggerSource = 'cron' as const;

  // Determine postedAfter: use latest DB post; fallback to yesterday 00:00:00Z
  let postedAfterIso: string;
  {
    const { rows } = await getPostsPage(1);
    if (rows.length > 0) {
      const latest = rows[0];
      const d =
        latest.createdAt instanceof Date
          ? latest.createdAt
          : new Date(latest.createdAt as unknown as string);
      postedAfterIso = d.toISOString();
    } else {
      const now = new Date();
      const yesterday = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - 1,
          0,
          0,
          0
        )
      );
      postedAfterIso = yesterday.toISOString();
    }
  }

  let totalFetched = 0;
  let newProducts = 0;
  let discardProducts = 0;
  let failedProducts = 0;

  try {
    const client = new NewPost(postedAfterIso);

    // Fetch loop with optional insertion limit
    for (;;) {
      const batch = await client.get();
      if (!batch) break;

      totalFetched += batch.length;
      const filtered = filterIndieProducts(batch);
      discardProducts += batch.length - filtered.length;

      for (const p of filtered) {
        const productId = Number(p.id);
        const record = toNewPostRecord(p);
        const exists = await existPost(productId);
        if (exists) {
          continue; // skip duplicates
        }
        try {
          const res = await insertPost(record);
          if (res) {
            newProducts += 1;
          } else {
            failedProducts += 1;
          }
        } catch (err) {
          failedProducts += 1;
        }
      }
    }

    const durationMs = Date.now() - startedAt;
    const status: 'success' | 'partial' | 'failed' =
      failedProducts > 0 ? 'partial' : 'success';

    await insertSyncLog({
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
      triggerSource,
    });

    return NextResponse.json({
      status: 'ok',
      data: {
        postedAfter: postedAfterIso,
        totalFetched,
        newProducts,
        discardProducts,
        failedProducts,
        durationMs,
        triggerSource,
      },
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;
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
        triggerSource,
      });
    } catch {
      // swallow logging error
    }

    return NextResponse.json(
      {
        status: 'error',
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
