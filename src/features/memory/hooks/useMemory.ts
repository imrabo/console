import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memorysService } from '../services/memory.service';
import { toast } from 'sonner';
import { type CreateMemoryDTO, type UpdateMemoryDTO, MemoryStatus, MemoryCategory } from '../types';

export const useMemorysQuery = (params?: any) => {
  return useQuery({
    queryKey: ['memorys-data', params],
    queryFn: () => memorysService.fetchMemorys(params),
  });
};

export const useMemoryQuery = (id: string) => {
  return useQuery({
    queryKey: ['memory', id],
    queryFn: () => memorysService.fetchMemoryById(id),
    enabled: !!id,
  });
};



export const useCreateMemoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMemoryDTO) => memorysService.createMemory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memorys-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Memory scheduled successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to schedule memory');
    },
  });
};

export const useUpdateMemoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemoryDTO }) =>
      memorysService.updateMemory(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['memorys-data'] });
      queryClient.invalidateQueries({ queryKey: ['memory', updated.data?.id] });
      toast.success(`Memory updated: ${updated.data?.title || 'Untitled'}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update memory details');
    },
  });
};

export const useDeleteMemoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memorysService.deleteMemory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memorys-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Memory removed permanently');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete memory');
    },
  });
};

export const useUpdateMemoryStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MemoryStatus }) =>
      memorysService.updateMemoryStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['memorys-data'] });
      queryClient.invalidateQueries({ queryKey: ['memory', updated.data?.id] });
      toast.success(`Memory status updated: ${updated.data?.status}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update memory status');
    },
  });
};

export const useToggleMemoryFeaturedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      memorysService.toggleMemoryFeatured(id, isFeatured),
    onSuccess: (updated: any) => {
      queryClient.invalidateQueries({ queryKey: ['memorys-data'] });
      queryClient.invalidateQueries({ queryKey: ['memory', updated.data?.id] });
      toast.success(`Memory featured status updated: ${updated.data?.isFeatured}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update featured status');
    },
  });
};

export const useToggleMemoryActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      memorysService.toggleMemoryActive(id, isActive),
    onSuccess: (updated: any) => {
      queryClient.invalidateQueries({ queryKey: ['memorys-data'] });
      queryClient.invalidateQueries({ queryKey: ['memory', updated.data?.id] });
      toast.success(`Memory active status updated: ${updated.data?.isActive}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update active status');
    },
  });
};

export const useFeaturedMemorysQuery = () => {
  return useQuery({
    queryKey: ['featured-memorys'],
    queryFn: () => memorysService.getFeaturedMemorys(),
  });
};

export const useUpcomingMemorysQuery = () => {
  return useQuery({
    queryKey: ['upcoming-memorys'],
    queryFn: () => memorysService.getUpcomingMemorys(),
  });
};

export const useMemorysByCategoryQuery = (category: MemoryCategory) => {
  return useQuery({
    queryKey: ['memorys-by-category', category],
    queryFn: () => memorysService.getMemorysByCategory(category),
    enabled: !!category,
  });
};

export const useValidateMemoryForRegistrationQuery = (memoryId: string) => {
  return useQuery({
    queryKey: ['memory-validation', memoryId],
    queryFn: () => memorysService.validateMemoryForRegistration(memoryId),
    enabled: !!memoryId,
  });
};
