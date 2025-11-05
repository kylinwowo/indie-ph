import { NextRequest, NextResponse } from 'next/server';
import { getPostsPage } from '@/models/post';

type CursorPayload = {
  createdAt: string;
  id: number;
};

function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function decodeCursor(cursor: string | null): CursorPayload | null {
  if (!cursor) return null;
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf8');
    const obj = JSON.parse(json) as CursorPayload;
    if (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.createdAt === 'string' &&
      typeof obj.id === 'number'
    ) {
      return obj;
    }
    return null;
  } catch {
    return null;
  }
}

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

    const data = rows.map((r) => ({
      id: r.id,
      postId: r.postId,
      name: r.name,
      tagline: r.tagline,
      thumbnail: r.thumbnail,
      url: r.url,
      website: r.website,
      createdAt:
        r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
      makers: r.makers,
      twitter: r.twitter,
      facebook: r.facebook,
      linkedin: r.linkedin,
      instagram: r.instagram,
      github: r.github,
    }));

    const nextCursor = hasNext
      ? encodeCursor({
          createdAt:
            data[data.length - 1]?.createdAt ?? new Date().toISOString(),
          id: data[data.length - 1]?.id ?? 0,
        })
      : null;

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
