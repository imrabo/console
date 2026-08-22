import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { workspacesService } from '../services/communityService';
import type { ICommunity } from '../types';

export const useOrganizationsQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.COMMUNITIES],
    queryFn: async () => {
      return await workspacesService.fetchOrganizations();
    },
  });
};

// export const useOrganizationsQuery = () => {
//   return useQuery({
//     queryKey: [COLLECTIONS.COMMUNITIES],
//     queryFn: async () => {
//       const [data] = await Promise.all([
//         workspacesService.fetchOrganizations(),

//       ]);
//       return { data };
//     },
//   });
// };

export const useCreateCommunityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => workspacesService.createCommunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.COMMUNITIES] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Neighborhood Community created successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create community group');
    },
  });
};

export const useDeleteCommunityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workspacesService.deleteCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.COMMUNITIES] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Community group removed');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete community group');
    },
  });
};

export const useCommunityQuery = (id: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.COMMUNITIES, id],
    queryFn: () => workspacesService.fetchCommunityById(id),
    enabled: !!id,
  });
};

export const useUpdateCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ICommunity>;
    }) => workspacesService.updateCommunity(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COMMUNITIES],
      });

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.COMMUNITIES, variables.id],
      });

      toast.success('Community updated successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update community');
    },
  });
};