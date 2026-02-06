import Constants from 'expo-constants';

import type {
  ApiErrorCode,
  AuthResponse,
  CommunitiesResponse,
  Community,
  FeedResponse,
  Post,
} from '@/lib/types';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  token?: string;
  query?: Record<string, string | number | undefined | null>;
};

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'http://localhost:3000';

const DEFAULT_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;

  constructor(status: number, code: ApiErrorCode, message?: string) {
    super(message ?? code);
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(path, API_BASE_URL);
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    if (qs) {
      url.search = qs;
    }
  }
  return url.toString();
}

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body, token = DEFAULT_TOKEN, query } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const code =
      data && typeof data === 'object' && 'error' in data ? (data.error as ApiErrorCode) : 'internal_error';
    throw new ApiError(response.status, code);
  }

  return data as T;
}

export async function register(email: string, password: string) {
  return requestJson<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { email, password },
  });
}

export async function login(email: string, password: string) {
  return requestJson<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function getCommunities() {
  const response = await requestJson<CommunitiesResponse>('/api/communities');
  return response.communities;
}

export async function createCommunity(data: Pick<Community, 'name' | 'description' | 'icon' | 'themeColor'>) {
  const response = await requestJson<{ community: Community }>('/api/communities', {
    method: 'POST',
    body: data,
  });
  return response.community;
}

export async function getPosts(params?: { communityId?: string; limit?: number; offset?: number }) {
  const response = await requestJson<FeedResponse>('/api/posts', {
    query: {
      communityId: params?.communityId,
      limit: params?.limit,
      offset: params?.offset,
    },
  });
  return response.posts;
}

export async function getPost(id: string) {
  const response = await requestJson<{ post: Post }>(`/api/posts/${id}`);
  return response.post;
}

export async function getFeed(params?: { communityId?: string; limit?: number; offset?: number }) {
  const response = await requestJson<FeedResponse>('/api/feed', {
    query: {
      communityId: params?.communityId,
      limit: params?.limit,
      offset: params?.offset,
    },
  });
  return response.posts;
}

export async function createPost(data: Pick<Post, 'communityId' | 'content' | 'imageUrls'>) {
  const response = await requestJson<{ post: Post }>('/api/posts', {
    method: 'POST',
    body: data,
  });
  return response.post;
}

export async function likePost(postId: string) {
  const response = await requestJson<{ liked: boolean }>('/api/likes', {
    method: 'POST',
    body: { postId },
  });
  return response.liked;
}

export async function unlikePost(postId: string) {
  const response = await requestJson<{ liked: boolean }>('/api/likes/unlike', {
    method: 'POST',
    body: { postId },
  });
  return response.liked;
}
