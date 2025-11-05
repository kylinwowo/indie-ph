import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Post table schema
export const post = pgTable(
  'post',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id').notNull().unique(),
    name: varchar('name', { length: 100 }),
    tagline: varchar('tagline', { length: 255 }),
    thumbnail: varchar('thumbnail', { length: 255 }),
    url: varchar('url', { length: 255 }),
    website: varchar('website', { length: 255 }),
    createdAt: timestamp('created_at').notNull(),
    makers: integer('makers').notNull(),
    twitter: varchar('twitter', { length: 255 }),
    facebook: varchar('facebook', { length: 255 }),
    linkedin: varchar('linkedin', { length: 255 }),
    instagram: varchar('instagram', { length: 255 }),
    github: varchar('github', { length: 255 }),
    enable: boolean('enable').default(true).notNull(),
  },
  (table) => ({
    postIdIdx: uniqueIndex('post_post_id_idx').on(table.postId),
    postCreatedAtIdx: index('post_created_at_idx').on(table.createdAt),
    postEnableIdx: index('post_enable_idx').on(table.enable),
  })
);

// Validate post insert schema
export const insertPostSchema = createInsertSchema(post, {
  postId: z.number().positive(),
  name: z.string().max(100).optional(),
  tagline: z.string().max(255).optional(),
  thumbnail: z.url().optional(),
  url: z.url().optional(),
  website: z.url().optional(),
  makers: z.number(),
  twitter: z.url().optional(),
  facebook: z.url().optional(),
  linkedin: z.url().optional(),
  instagram: z.url().optional(),
  github: z.url(),
});

// Export types
export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;
