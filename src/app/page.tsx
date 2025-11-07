'use client';

import { useEffect } from 'react';
import { usePostsStore } from '@/store/posts';
import { PostCard } from '@/components/post-card';
import PostCardSkeleton from '@/components/post-card-skeleton';

export default function Home() {
  const { items, loading, error, hasNext, fetchInitial, fetchMore } =
    usePostsStore();

  useEffect(() => {
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Indie Products</h1>
          <p className="text-sm text-muted-foreground">
            Curated products with public GitHub repositories
          </p>
        </header>

        {error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm">
            {error}
          </div>
        ) : null}

        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy={loading}
        >
          {loading && items.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            : items.map((item) => <PostCard key={item.id} item={item} />)}
        </section>

        <div className="mt-8 flex justify-center">
          {hasNext ? (
            <button
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-muted px-4 text-sm hover:bg-muted/70"
              onClick={() => fetchMore()}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">No more products</p>
          )}
        </div>
      </main>
    </div>
  );
}
