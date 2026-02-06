export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'not_found'
  | 'conflict'
  | 'internal_error';

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'bearer' | string;
  user: AuthUser;
};

export type Community = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  themeColor: string;
  createdBy: string;
  createdAt: string;
};

export type Post = {
  id: string;
  communityId: string;
  userId: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
};

export type FeedResponse = {
  posts: Post[];
  limit: number;
  offset: number;
};

export type CommunitiesResponse = {
  communities: Community[];
};
