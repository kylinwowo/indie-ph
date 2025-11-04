import { db, post } from '@/db';
import { eq } from 'drizzle-orm';
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
