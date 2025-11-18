'use client';

import { useEffect } from 'react';
import { usePostsStore, type PostItem } from '@/store/posts';
import { PostCard } from '@/components/post-card';
import PostCardSkeleton from '@/components/post-card-skeleton';
import InfiniteScroll from '@/components/ui/infinite-scroll';

type Props = {
  initialItems: PostItem[];
  hasNext: boolean;
  nextCursor: string | null;
  pageSize: number;
};

export default function PostsPageClient({
  initialItems,
  hasNext,
  nextCursor,
  pageSize,
}: Props) {
  const {
    items,
    loading,
    error,
    hasNext: storeHasNext,
    fetchMore,
  } = usePostsStore();

  // Hydrate the store with server-fetched initial page on mount
  useEffect(() => {
    usePostsStore.setState({
      items: initialItems,
      hasNext,
      nextCursor,
      pageSize,
      loading: false,
      error: null,
    });
  }, [initialItems, hasNext, nextCursor, pageSize]);

  return (
    <>
      <InfiniteScroll
        isLoading={loading}
        hasMore={storeHasNext}
        next={fetchMore}
        threshold={1}
        root={null}
        rootMargin="200px"
      >
        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy={loading}
        >
          {loading && items.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : items.map((item) => <PostCard key={item.id} item={item} />)}
          {loading && items.length > 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={`more-${i}`} />
              ))
            : null}
        </section>

        <div className="mt-6 flex justify-center">
          {error && storeHasNext ? (
            <button
              className="inline-flex h-9 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 px-4 text-sm text-destructive hover:bg-destructive/15"
              onClick={() => fetchMore()}
            >
              Retry loading
            </button>
          ) : !storeHasNext ? (
            <p className="text-sm text-muted-foreground">No more products</p>
          ) : null}
        </div>
      </InfiniteScroll>
    </>
  );
}
