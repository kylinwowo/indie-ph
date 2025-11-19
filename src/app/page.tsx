import { getPostsPage } from '@/models/post';
import PostsPageClient from '../components/posts-page-client';
import { toPostItem, computeNextCursor } from '@/lib/posts-serialize';
import { RiGithubFill } from 'react-icons/ri';

export default async function Home() {
  const limitEnv = process.env.POSTS_PAGE_SIZE;
  const limit = limitEnv ? Number(limitEnv) : 10;

  // Fetch first page server-side
  const { rows, hasNext } = await getPostsPage(limit);
  const initialItems = rows.map(toPostItem);
  const nextCursor = computeNextCursor(initialItems, hasNext);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              Open Source Products on Product Hunt
            </h1>
            <a
              href="https://github.com/kylinwowo/indie-ph"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub repository"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted rounded-md"
            >
              <RiGithubFill size={24} className="text-primary" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Discover open-source projects featured on Product Hunt with public
            GitHub repositories
          </p>
        </header>

        <PostsPageClient
          initialItems={initialItems}
          hasNext={hasNext}
          nextCursor={nextCursor}
          pageSize={limit}
        />
      </main>
    </div>
  );
}
