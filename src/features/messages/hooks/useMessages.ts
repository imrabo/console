import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import messagesService from '../services/messagesService';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { IMessage } from '../types';

/**
 * Fetch Messages
 */
export const useMessagesQuery = (groupId: string) => {
  return useQuery<IMessage[]>({
    queryKey: [COLLECTIONS.MESSAGES, groupId],
    queryFn: () => messagesService.fetchMessagesByGroupId(groupId),
    enabled: !!groupId,
  });
};

/**
 * Create Message
 */
export const useCreateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => messagesService.createMessage(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.MESSAGES, variables.conversationId],
      });

      toast.success('Message sent successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to send message');
    },
  });
};

/**
 * Update Message
 */
export const useUpdateMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) => messagesService.updateMessage(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.MESSAGES, variables.data.conversationId],
      });

      toast.success('Message updated successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update message');
    },
  });
};

/**
 * Delete Message
 */
export const useDeleteMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      conversationId,
    }: {
      id: string;
      conversationId: string;
    }) => messagesService.deleteMessage(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.MESSAGES, variables.conversationId],
      });

      toast.success('Message deleted successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete message');
    },
  });
};
