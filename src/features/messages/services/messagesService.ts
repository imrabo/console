import { apiClient } from '@/lib/api/client';
import { IMessage } from '../types';

export const messagesService = {
  /**
   * Fetch all messages for a conversation
   */
  async fetchMessages(conversationId: string) {
    return apiClient.get<IMessage[]>(
      `/messages?conversationId=${conversationId}`
    );
  },
  /**
   * Fetch all messages for a conversation
   */
  async fetchMessagesByGroupId(groupId: string) {
    return apiClient.get<IMessage[]>(
      `/messages?groupId=${groupId}`
    );
  },

  /**
   * Fetch a single message
   */
  async fetchMessageById(id: string) {
    return apiClient.get<IMessage>(`/messages/${id}`);
  },

  /**
   * Create a new message
   */
  async createMessage(
    data: Omit<IMessage, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return apiClient.post<IMessage>('/messages', data);
  },

  /**
   * Update an existing message
   */
  async updateMessage(
    id: string,
    data: Partial<IMessage>
  ) {
    return apiClient.patch<IMessage>(
      `/messages/${id}`,
      data
    );
  },

  /**
   * Delete a message
   */
  async deleteMessage(id: string) {
    return apiClient.delete<void>(
      `/messages/${id}`
    );
  },
};

export default messagesService;