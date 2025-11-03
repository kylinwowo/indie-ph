import {
  ProductHuntApiResponse,
  ProductHuntErrorResponse,
  PostsQueryVariables,
  POSTS_QUERY,
  SimplePost,
  PostNode,
} from './types';

const PRODUCTHUNT_API_URL = 'https://api.producthunt.com/v2/api/graphql';

/**
 * ProductHunt API Client
 * Used to fetch new posts from ProductHunt API
 */
export class NewPost {
  private apiToken: string;
  private postedAfter: string;
  private cursor: string | null = null;
  private hasNextPage: boolean = true;

  constructor(postedAfter: string) {
    this.apiToken = process.env.PRODUCTHUNT_API_TOKEN || '';
    if (!this.apiToken) {
      throw new Error(
        'ProductHunt API token is required. Please set PRODUCTHUNT_API_TOKEN environment variable.'
      );
    }

    this.postedAfter = this.validateAndFormatDate(postedAfter);
  }

  /**
   * Validate and format date string to ISO-8601 format
   * @returns string return formatted date string
   */
  private validateAndFormatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(
        `Invalid date format: ${dateString}. Please provide a valid ISO-8601 date string.`
      );
    }
    return date.toISOString();
  }

  /**
   * Get next batch of product data
   * @returns Promise<SimplePost[] | null> return array of posts if available, null if no more data
   */
  async get(): Promise<SimplePost[] | null> {
    if (!this.hasNextPage) {
      return null;
    }

    try {
      const response = await this.makeApiRequest();
      const posts = this.transformPosts(
        response.data.posts.edges.map((edge) => edge.node)
      );

      // Update pagination info
      this.cursor = response.data.posts.pageInfo.endCursor;
      this.hasNextPage = response.data.posts.pageInfo.hasNextPage;

      return posts.length > 0 ? posts : null;
    } catch (error) {
      console.error('Failed to fetch posts from ProductHunt:', error);
      throw error;
    }
  }

  /**
   * Make API request to ProductHunt GraphQL endpoint
   * @returns Promise<ProductHuntApiResponse> return API response
   */
  private async makeApiRequest(): Promise<ProductHuntApiResponse> {
    const variables: PostsQueryVariables = {
      order: 'NEWEST',
      postedAfter: this.postedAfter,
      after: this.cursor || undefined,
    };

    const requestBody = {
      query: POSTS_QUERY,
      variables,
    };

    const response = await fetch(PRODUCTHUNT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
        'User-Agent': 'IndiePH/1.0',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    if (data.errors) {
      const errorResponse = data as ProductHuntErrorResponse;
      throw new Error(
        `GraphQL error: ${errorResponse.errors.map((e) => e.message).join(', ')}`
      );
    }

    return data as ProductHuntApiResponse;
  }

  /**
   * Transform ProductHunt API response nodes to simplified Post format
   * @returns SimplePost[] array of transformed post objects
   */
  private transformPosts(nodes: PostNode[]): SimplePost[] {
    return nodes.map((node) => ({
      id: node.id,
      name: node.name,
      tagline: node.tagline,
      url: node.url,
      createdAt: node.createdAt,
      makersCount: node.makers.length,
      thumbnail: node.thumbnail.type === 'image' ? node.thumbnail.url : '',
      website: node.website,
      twitter:
        node.productLinks.find((link) => link.type === 'Twitter')?.url || '',
      facebook:
        node.productLinks.find((link) => link.type === 'Facebook')?.url || '',
      instagram:
        node.productLinks.find((link) => link.type === 'Instagram')?.url || '',
      linkedin:
        node.productLinks.find((link) => link.type === 'LinkedIn')?.url || '',
      github:
        node.productLinks.find((link) => link.type === 'Github')?.url || '',
    }));
  }

  /**
   * Reset pagination state to start fetching from the beginning
   */
  reset(): void {
    this.cursor = null;
    this.hasNextPage = true;
  }

  /**
   * Get current pagination state
   * @returns { cursor: string | null; hasNextPage: boolean } return current cursor and hasNextPage flag
   */
  getPageInfo(): { cursor: string | null; hasNextPage: boolean } {
    return {
      cursor: this.cursor,
      hasNextPage: this.hasNextPage,
    };
  }

  /**
   * Set new postedAfter date and reset pagination state
   * @param postedAfter new postedAfter date string
   */
  setPostedAfter(postedAfter: string): void {
    this.postedAfter = this.validateAndFormatDate(postedAfter);
    this.reset();
  }
}
