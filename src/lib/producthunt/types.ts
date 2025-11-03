export interface Maker {
  id: string;
}

export interface ProductLink {
  type: string;
  url: string;
}

export interface Thumbnail {
  type: string;
  url: string;
}

export interface PostNode {
  id: string;
  name: string;
  tagline: string;
  url: string;
  createdAt: string;
  makers: Maker[];
  productLinks: ProductLink[];
  thumbnail: Thumbnail;
  website: string;
}

export interface PostEdge {
  node: PostNode;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface PostsResponse {
  edges: PostEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ProductHuntApiResponse {
  data: {
    posts: PostsResponse;
  };
}

export interface PostsQueryVariables {
  order: 'NEWEST' | 'FEATURED_AT' | 'RANKING' | 'VOTES';
  postedAfter: string;
  after?: string;
}

export const POSTS_QUERY = `
  query getPosts($order: PostsOrder!, $postedAfter: DateTime!, $after: String) {
    posts(order: $order, postedAfter: $postedAfter, after: $after) {
      edges {
        node {
          id
          name
          tagline
          url
          createdAt
          makers {
            id
          }
          productLinks {
            type
            url
          }
          thumbnail {
            type
            url
          }
          website
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export interface ProductHuntApiError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: {
    code: string;
    [key: string]: unknown;
  };
}

export interface ProductHuntErrorResponse {
  errors: ProductHuntApiError[];
}

export interface SimplePost {
  id: string;
  name: string;
  tagline: string;
  url: string;
  createdAt: string;
  makersCount: number;
  thumbnail: string;
  website: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
}
