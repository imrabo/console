import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import webinarsService from '../services/webinars.service';
import { toast } from 'sonner';
import { CreateWebinarDTO, UpdateWebinarDTO, WebinarStatus, WebinarCategory } from '../types';

export * from './useWebinarRegistrations';

export const useWebinarsQuery = (params?: any) => {
  return useQuery({
    queryKey: ['webinars-data', params],
    queryFn: () => webinarsService.fetchWebinars(params),
  });
};

export const useWebinarQuery = (id: string) => {
  return useQuery({
    queryKey: ['webinar', id],
    queryFn: () => webinarsService.fetchWebinarById(id),
    enabled: !!id,
  });
};

export const useWebinarDetailsQuery = (webinarId: string) => {
  return useQuery({
    queryKey: ['webinar-details', webinarId],
    queryFn: () => webinarsService.fetchRegistrationsByWebinar(webinarId),
    enabled: !!webinarId,
  });
};

export const useCreateWebinarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWebinarDTO) => webinarsService.createWebinar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Webinar scheduled successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to schedule webinar');
    },
  });
};

export const useUpdateWebinarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebinarDTO }) =>
      webinarsService.updateWebinar(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['webinars-data'] });
      queryClient.invalidateQueries({ queryKey: ['webinar', updated.id] });
      toast.success(`Webinar updated: ${updated.title}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update webinar details');
    },
  });
};

export const useDeleteWebinarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => webinarsService.deleteWebinar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Webinar removed permanently');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete webinar');
    },
  });
};

export const useUpdateWebinarStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WebinarStatus }) =>
      webinarsService.updateWebinarStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['webinars-data'] });
      queryClient.invalidateQueries({ queryKey: ['webinar', updated.id] });
      toast.success(`Webinar status updated: ${updated.status}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update webinar status');
    },
  });
};

export const useToggleWebinarFeaturedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      webinarsService.toggleWebinarFeatured(id, isFeatured),
    onSuccess: (updated: any) => {
      queryClient.invalidateQueries({ queryKey: ['webinars-data'] });
      queryClient.invalidateQueries({ queryKey: ['webinar', updated.id] });
      toast.success(`Webinar featured status updated: ${updated.isFeatured}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update featured status');
    },
  });
};

export const useToggleWebinarActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      webinarsService.toggleWebinarActive(id, isActive),
    onSuccess: (updated: any) => {
      queryClient.invalidateQueries({ queryKey: ['webinars-data'] });
      queryClient.invalidateQueries({ queryKey: ['webinar', updated.id] });
      toast.success(`Webinar active status updated: ${updated.isActive}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update active status');
    },
  });
};

export const useFeaturedWebinarsQuery = () => {
  return useQuery({
    queryKey: ['featured-webinars'],
    queryFn: () => webinarsService.getFeaturedWebinars(),
  });
};

export const useUpcomingWebinarsQuery = () => {
  return useQuery({
    queryKey: ['upcoming-webinars'],
    queryFn: () => webinarsService.getUpcomingWebinars(),
  });
};

export const useWebinarsByCategoryQuery = (category: WebinarCategory) => {
  return useQuery({
    queryKey: ['webinars-by-category', category],
    queryFn: () => webinarsService.getWebinarsByCategory(category),
    enabled: !!category,
  });
};

export const useValidateWebinarForRegistrationQuery = (webinarId: string) => {
  return useQuery({
    queryKey: ['webinar-validation', webinarId],
    queryFn: () => webinarsService.validateWebinarForRegistration(webinarId),
    enabled: !!webinarId,
  });
};
