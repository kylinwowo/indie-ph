'use client';

import { create } from 'zustand';

export type PostItem = {
  id: number;
  postId: number;
  name: string;
  tagline: string;
  thumbnail: string;
  url: string;
  website: string | null;
  createdAt: string; // ISO string from API
  makers: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;
  enable: boolean;
};

type ApiOk = {
  status: 'ok';
  data: PostItem[];
  pagination: {
    limit: number;
    hasNext: boolean;
    nextCursor: string | null;
  };
};

type ApiErr = {
  status: 'error';
  error: { message: string };
};

export interface PostsState {
  items: PostItem[];
  loading: boolean;
  error: string | null;
  hasNext: boolean;
  nextCursor: string | null;
  pageSize: number;
  fetchInitial: () => Promise<void>;
  fetchMore: () => Promise<void>;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  hasNext: true,
  nextCursor: null,
  pageSize: Number(process.env.POSTS_PAGE_SIZE ?? 10) || 10,
  async fetchInitial() {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      const json = (await res.json()) as ApiOk | ApiErr;
      if ('status' in json && json.status === 'ok') {
        set({
          items: json.data,
          hasNext: json.pagination.hasNext,
          nextCursor: json.pagination.nextCursor,
          pageSize: json.pagination.limit,
          loading: false,
        });
      } else {
        throw new Error((json as ApiErr).error?.message ?? 'Unknown error');
      }
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : String(e),
        loading: false,
      });
    }
  },
  async fetchMore() {
    const { loading, hasNext, nextCursor } = get();
    if (loading || !hasNext) return;
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (nextCursor) params.set('cursor', nextCursor);
      const res = await fetch(`/api/posts?${params.toString()}`, {
        cache: 'no-store',
      });
      const json = (await res.json()) as ApiOk | ApiErr;
      if ('status' in json && json.status === 'ok') {
        set({
          items: [...get().items, ...json.data],
          hasNext: json.pagination.hasNext,
          nextCursor: json.pagination.nextCursor,
          pageSize: json.pagination.limit,
          loading: false,
        });
      } else {
        throw new Error((json as ApiErr).error?.message ?? 'Unknown error');
      }
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : String(e),
        loading: false,
      });
    }
  },
}));
