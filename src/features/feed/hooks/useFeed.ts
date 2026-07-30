import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import feedService from '../services/feedService';
import { CreateFeedPostRequest, FeedPost } from '../types';
import { QUERY_KEYS } from '@/lib/constants/QUERY_KEYS';



export const usePostsQuery = () => {
  return useQuery<FeedPost[]>({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: () => feedService.fetchPosts(),
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: CreateFeedPostRequest) => feedService.createPost(post),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });

      toast.success('Post created successfully');
    },

    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create post');
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => feedService.deletePost(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });

      toast.success('Post removed permanently');
    },

    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete post');
    },
  });
};
