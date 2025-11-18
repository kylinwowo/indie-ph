import { NextRequest, NextResponse } from 'next/server';
import { getPostsPage } from '@/models/post';
import { decodeCursor } from '@/lib/cursor';
import { toPostItem, computeNextCursor } from '@/lib/posts-serialize';

/**
 * GET /api/posts
 * Query params:
 * - cursor?: string (base64 encoded { createdAt: ISO, id: number })
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const cursorParam = url.searchParams.get('cursor');

  const limitEnv = process.env.POSTS_PAGE_SIZE;
  const limit = limitEnv ? Number(limitEnv) : 10;
  const cursor = decodeCursor(cursorParam);

  try {
    const cursorDate = cursor ? new Date(cursor.createdAt) : undefined;
    const { rows, hasNext } = await getPostsPage(
      limit,
      cursor && cursorDate && !isNaN(cursorDate.getTime())
        ? { createdAt: cursorDate, id: cursor.id }
        : undefined
    );

    const data = rows.map(toPostItem);
    const nextCursor = computeNextCursor(data, hasNext);

    return NextResponse.json({
      status: 'ok',
      data,
      pagination: {
        limit,
        hasNext,
        nextCursor,
      },
    });
  } catch (error) {
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
