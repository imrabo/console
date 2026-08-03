import { apiClient } from '@/lib/api/client';

import type {
  Agent,
  AgentCategory,
  AgentRegistration,
  AgentWaitlist,
} from '@/features/agents/types/index';

export const agentsService = {
  async fetchAgents() {
    return apiClient.get<Agent[]>('/agents');
  },

  async fetchAgentById(id: string) {
    return apiClient.get<Agent>(`/agents/${id}`);
  },

  async fetchCategories() {
    return apiClient.get<AgentCategory[]>('/agents/categories');
  },

  async fetchRegistrations(agentId: string) {
    return apiClient.get<AgentRegistration[]>(
      `/agents/${agentId}/registrations`
    );
  },

  async fetchWaitlist(agentId: string) {
    return apiClient.get<AgentWaitlist[]>(
      `/agents/${agentId}/waitlist`
    );
  },

  async createAgent(
    data: Omit<
      Agent,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'registrationsCount'
      | 'waitlistCount'
      | 'status'
    >
  ) {
    return apiClient.post<Agent>('/agents', {
      ...data,
      registrationsCount: 0,
      waitlistCount: 0,
      status: 'Active',
    });
  },

  async updateAgent(id: string, data: Partial<Agent>) {
    return apiClient.patch<Agent>(`/agents/${id}`, data);
  },

  async deleteAgent(id: string) {
    return apiClient.delete<void>(`/agents/${id}`);
  },
};

export default agentsService;