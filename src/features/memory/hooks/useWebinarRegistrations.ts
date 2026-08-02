import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import webinarsService from '../services/webinars.service';
import {
  WebinarRegistration,
  CreateWebinarRegistrationDTO,
  UpdateWebinarRegistrationDTO,
} from '../types';

export const useRegistrationsQuery = (params?: any) => {
  return useQuery({
    queryKey: ['webinar-registrations', params],
    queryFn: () => webinarsService.fetchRegistrations(params),
  });
};

export const useRegistrationQuery = (id: string) => {
  return useQuery({
    queryKey: ['webinar-registration', id],
    queryFn: () =>
      webinarsService
        .fetchRegistrations({ limit: 1, page: 1 })
        .then((registrations) => registrations.find((r) => r.id === id)),
    enabled: !!id,
  });
};

export const useWebinarRegistrationsQuery = (webinarId: string) => {
  return useQuery({
    queryKey: ['webinar-registrations-by-webinar', webinarId],
    queryFn: () => webinarsService.fetchRegistrationsByWebinar(webinarId),
    enabled: !!webinarId,
  });
};

export const useUserRegistrationsQuery = (userId: string) => {
  return useQuery({
    queryKey: ['webinar-registrations-by-user', userId],
    queryFn: () => webinarsService.fetchRegistrationsByUser(userId),
    enabled: !!userId,
  });
};

export const useCreateRegistrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWebinarRegistrationDTO) => webinarsService.createRegistration(data),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations-by-webinar', registration.webinarId],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-details', registration.webinarId],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinars-data'],
      });
      toast.success('Successfully registered for webinar');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to register for webinar');
    },
  });
};

export const useUpdateRegistrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebinarRegistrationDTO }) =>
      webinarsService.updateRegistration(id, data),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations-by-webinar', registration.webinarId],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations-by-user', registration.userId],
      });
      toast.success('Registration updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update registration');
    },
  });
};

export const useDeleteRegistrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => webinarsService.deleteRegistration(id),
    onSuccess: (_, registrationId) => {
      // We need to get the webinarId from the registration to invalidate the right queries
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinars-data'],
      });
      toast.success('Registration removed successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete registration');
    },
  });
};

export const useMarkAttendanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      registrationId,
      joinedAt,
      leftAt,
    }: {
      registrationId: string;
      joinedAt: Date | string;
      leftAt?: Date | string;
    }) => webinarsService.markAttendance(registrationId, joinedAt, leftAt),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations-by-webinar', registration.webinarId],
      });
      toast.success('Attendance marked successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to mark attendance');
    },
  });
};

export const useUpdateRegistrationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ registrationId, status }: { registrationId: string; status: any }) =>
      webinarsService.updateRegistrationStatus(registrationId, status),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      toast.success('Registration status updated');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update registration status');
    },
  });
};

export const useUpdatePaymentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      registrationId,
      status,
      paymentId,
    }: {
      registrationId: string;
      status: any;
      paymentId?: string;
    }) => webinarsService.updatePaymentStatus(registrationId, status, paymentId),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      toast.success('Payment status updated');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update payment status');
    },
  });
};

export const useIssueCertificateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: string) => webinarsService.issueCertificate(registrationId),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      toast.success('Certificate issued successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to issue certificate');
    },
  });
};

export const useMarkFeedbackSubmittedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: string) => webinarsService.markFeedbackSubmitted(registrationId),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      toast.success('Feedback marked as submitted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to mark feedback as submitted');
    },
  });
};

export const useMarkReminderSentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: string) => webinarsService.markReminderSent(registrationId),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({
        queryKey: ['webinar-registration', registration.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['webinar-registrations'],
      });
      toast.success('Reminder marked as sent');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to mark reminder as sent');
    },
  });
};
