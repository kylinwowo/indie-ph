// Import Drizzle-inferred types
import type { Post, NewPost, SyncLog, NewSyncLog } from '@/db';

// Re-export Drizzle types with more descriptive names
export type Product = Post;
export type NewProduct = NewPost;
export type { SyncLog, NewSyncLog };

// API response types
export interface ProductListResponse {
  data: Product[];
  pagination: {
    pageSize: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
