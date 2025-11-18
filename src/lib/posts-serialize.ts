import type { Post } from '@/db/post';
import type { PostItem } from '@/store/posts';
import { encodeCursor } from '@/lib/cursor';

export function toPostItem(r: Post): PostItem {
  return {
    id: r.id,
    postId: r.postId,
    name: r.name ?? '',
    tagline: r.tagline ?? '',
    thumbnail: r.thumbnail ?? '',
    url: r.url ?? '',
    website: r.website ?? null,
    createdAt:
      r.createdAt instanceof Date
        ? r.createdAt.toISOString()
        : String(r.createdAt),
    makers: r.makers != null ? String(r.makers) : null,
    twitter: r.twitter ?? null,
    facebook: r.facebook ?? null,
    linkedin: r.linkedin ?? null,
    instagram: r.instagram ?? null,
    github: r.github ?? null,
    enable: r.enable ?? true,
  };
}

export function computeNextCursor(
  items: PostItem[],
  hasNext: boolean
): string | null {
  if (!hasNext) return null;
  const last = items[items.length - 1];
  const payload = {
    createdAt: last?.createdAt ?? new Date().toISOString(),
    id: last?.id ?? 0,
  };
  return encodeCursor(payload);
}
