import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import agentsService from '../services/agentsService';
import { toast } from 'sonner';

export const useAgentsQuery = () => {
  return useQuery({
    queryKey: ['agents-data'],
    queryFn: async () => {
      const [agents, categories] = await Promise.all([
        agentsService.fetchAgents(),
        agentsService.fetchCategories(),
      ]);
      return { agents, categories };
    },
  });
};

export const useAgentDetailsQuery = (agentId: string) => {
  return useQuery({
    queryKey: ['agent-details', agentId],
    queryFn: async () => {
      if (!agentId) return null;
      const [registrations, waitlist] = await Promise.all([
        agentsService.fetchRegistrations(agentId),
        agentsService.fetchWaitlist(agentId),
      ]);
      return { registrations, waitlist };
    },
    enabled: !!agentId,
  });
};

export const useCreateAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => agentsService.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Agent event scheduled successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to schedule agent event');
    },
  });
};

export const useUpdateAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => agentsService.updateAgent(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['agents-data'] });
      toast.success(`Updated details for agent: ${updated.title}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update agent event');
    },
  });
};

export const useDeleteAgentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agentsService.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Agent event removed from calendar');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel agent event');
    },
  });
};
