import { ApiClient } from '@/lib/api/client';
import type { PaginatedResponse } from '@/types/PaginatedResponse';
import type { CreateFeedPostRequest, FeedPost } from '../types';

export const feedService = {
  async fetchPosts(): Promise<FeedPost[]> {
    const response = await new ApiClient().get<PaginatedResponse<FeedPost>>('/posts');
    return response.data;
  },

  async createPost(request: CreateFeedPostRequest): Promise<void> {
    await new ApiClient().post('/posts', request);
  },

  async deletePost(postId: string): Promise<void> {
    await new ApiClient().delete(`/posts/${postId}`);
  },
};
export default feedService;
