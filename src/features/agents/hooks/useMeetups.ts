import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import meetupsService from '../services/meetupsService';
import { toast } from 'sonner';

export const useMeetupsQuery = () => {
  return useQuery({
    queryKey: ['meetups-data'],
    queryFn: async () => {
      const [meetups, categories] = await Promise.all([
        meetupsService.fetchMeetups(),
        meetupsService.fetchCategories(),
      ]);
      return { meetups, categories };
    },
  });
};

export const useMeetupDetailsQuery = (meetupId: string) => {
  return useQuery({
    queryKey: ['meetup-details', meetupId],
    queryFn: async () => {
      if (!meetupId) return null;
      const [registrations, waitlist] = await Promise.all([
        meetupsService.fetchRegistrations(meetupId),
        meetupsService.fetchWaitlist(meetupId),
      ]);
      return { registrations, waitlist };
    },
    enabled: !!meetupId,
  });
};

export const useCreateMeetupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => meetupsService.createMeetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetups-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Meetup event scheduled successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to schedule meetup event');
    },
  });
};

export const useUpdateMeetupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => meetupsService.updateMeetup(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['meetups-data'] });
      toast.success(`Updated details for meetup: ${updated.title}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update meetup event');
    },
  });
};

export const useDeleteMeetupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => meetupsService.deleteMeetup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetups-data'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      toast.success('Meetup event removed from calendar');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel meetup event');
    },
  });
};
