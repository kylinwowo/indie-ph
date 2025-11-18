import type { SimplePost } from '@/lib/producthunt';

/**
 * Filter posts to include only products with a GitHub URL.
 * Criteria: `github` exists and is a non-empty string after trimming.
 */
export function filterIndieProducts(posts: SimplePost[]): SimplePost[] {
  return posts.filter(
    (p) => typeof p.github === 'string' && p.github.trim().length > 0
  );
}

/**
 * Normalize optional URL-like fields: convert empty string to undefined
 */
export function normalizeOptionalUrl(
  value: string | undefined
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

/**
 * Map SimplePost (ProductHunt) to NewPost record for DB insertion.
 */
export function toNewPostRecord(p: SimplePost) {
  return {
    postId: Number(p.id),
    name: p.name || undefined,
    tagline: p.tagline || undefined,
    thumbnail: normalizeOptionalUrl(p.thumbnail),
    url: normalizeOptionalUrl(p.url),
    website: normalizeOptionalUrl(p.website),
    createdAt: new Date(p.createdAt),
    makers: p.makersCount,
    twitter: normalizeOptionalUrl(p.twitter),
    facebook: normalizeOptionalUrl(p.facebook),
    linkedin: normalizeOptionalUrl(p.linkedin),
    instagram: normalizeOptionalUrl(p.instagram),
    github: normalizeOptionalUrl(p.github),
    enable: true,
  };
}
