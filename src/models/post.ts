import { db, post } from '@/db';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { insertPostSchema, type NewPost } from '@/db/post';
import type { Post } from '@/db/post';

export async function existPost(postId: number): Promise<boolean> {
  const rows = await db.select().from(post).where(eq(post.postId, postId));
  return rows.length > 0;
}

export async function insertPost(
  record: NewPost
): Promise<NewPost | undefined> {
  const validated = insertPostSchema.parse(record);
  const [insertedPost] = await db.insert(post).values(validated).returning();
  return insertedPost;
}

export async function getPostByPostId(postId: number): Promise<Post | null> {
  const rows = await db.select().from(post).where(eq(post.postId, postId));
  return rows[0] ?? null;
}

// Paginated query for posts with enable=true, ordered by createdAt DESC, id DESC.
// Applies a cursor of shape { createdAt: Date; id: number } with lexicographic ordering.
export async function getPostsPage(
  limit: number,
  cursor?: { createdAt: Date; id: number }
): Promise<{ rows: Post[]; hasNext: boolean }> {
  const baseWhere = eq(post.enable, true);

  const whereExpr = (() => {
    if (!cursor) return baseWhere;
    const cursorDate = cursor.createdAt;
    if (!(cursorDate instanceof Date) || isNaN(cursorDate.getTime())) {
      return baseWhere;
    }
    const cursorCond = or(
      lt(post.createdAt, cursorDate),
      and(eq(post.createdAt, cursorDate), lt(post.id, cursor.id))
    );
    return and(baseWhere, cursorCond);
  })();

  const rows = await db
    .select()
    .from(post)
    .where(whereExpr)
    .orderBy(desc(post.createdAt), desc(post.id))
    .limit(limit + 1);

  const hasNext = rows.length > limit;
  return { rows: rows.slice(0, limit), hasNext };
}
