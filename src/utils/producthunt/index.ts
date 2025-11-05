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
