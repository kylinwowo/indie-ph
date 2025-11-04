import type { SimplePost } from '@/lib/producthunt';

/**
 * Filter posts to include only indie products
 * Criteria: makersCount <= 3
 */
export function filterIndieProducts(posts: SimplePost[]): SimplePost[] {
  return posts.filter((p) => p.makersCount <= 3);
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
