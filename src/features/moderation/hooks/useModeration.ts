'use client';

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';


import {
    CreateModerationFormValues,
    EditModerationFormValues,
} from '../schemas';
import { ModerationType } from '../types';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import moderationService from '../services/moderation.service';

export const useModerationCasesQuery = () => {
    return useQuery({
        queryKey: [COLLECTIONS.MODERATION_CASES],
        queryFn: () => moderationService.fetchModerationCases(),
    });
};

export const useModerationCaseQuery = (id: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: [COLLECTIONS.MODERATION_CASES, id],
        queryFn: () =>
            moderationService.fetchModerationCaseById(id),

        initialData: () => {
            const moderationCases =
                queryClient.getQueryData<ModerationType[]>([
                    COLLECTIONS.MODERATION_CASES,
                ]);

            return moderationCases?.find(
                (item) => item.id === id
            );
        },
    });
};

export const useCreateModerationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateModerationFormValues) =>
            moderationService.createModerationCase(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.MODERATION_CASES],
            });

            toast.success(
                'Moderation case created successfully'
            );
        },

        onError: (err: any) => {
            toast.error(
                err.message ||
                'Failed to create moderation case'
            );
        },
    });
};

export const useUpdateModerationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: EditModerationFormValues;
        }) =>
            moderationService.updateModerationCase(
                id,
                data
            ),

        onSuccess: (updated) => {
            queryClient.setQueryData(
                [COLLECTIONS.MODERATION_CASES, updated.id],
                updated
            );

            queryClient.setQueryData<ModerationType[]>(
                [COLLECTIONS.MODERATION_CASES],
                (old) =>
                    old?.map((item) =>
                        item.id === updated.id
                            ? updated
                            : item
                    ) ?? []
            );

            toast.success(
                'Moderation case updated successfully'
            );
        },

        onError: (err: any) => {
            toast.error(
                err.message ||
                'Failed to update moderation case'
            );
        },
    });
};

export const useDeleteModerationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            moderationService.deleteModerationCase(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.MODERATION_CASES],
            });

            toast.success(
                'Moderation case deleted successfully'
            );
        },

        onError: (err: any) => {
            toast.error(
                err.message ||
                'Failed to delete moderation case'
            );
        },
    });
};

export const useUpdateModerationStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: ModerationType['status'];
        }) =>
            moderationService.updateModerationStatus(
                id,
                status
            ),

        onSuccess: (updated) => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.MODERATION_CASES],
            });

            toast.success(
                `Status updated to ${updated.status}`
            );
        },

        onError: (err: any) => {
            toast.error(
                err.message ||
                'Failed to update status'
            );
        },
    });
};

export const useAssignModeratorMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            assignedModeratorId,
        }: {
            id: string;
            assignedModeratorId: string;
        }) =>
            moderationService.assignModerator(
                id,
                assignedModeratorId
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.MODERATION_CASES],
            });

            toast.success(
                'Moderator assigned successfully'
            );
        },

        onError: (err: any) => {
            toast.error(
                err.message ||
                'Failed to assign moderator'
            );
        },
    });
};

export const useTakeModerationActionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            action,
            moderatorNote,
        }: {
            id: string;
            action: ModerationType['action'];
            moderatorNote?: string;
        }) =>
            moderationService.takeAction(
                id,
                action,
                moderatorNote
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [COLLECTIONS.MODERATION_CASES],
            });

            toast.success(
                'Moderation action applied successfully'
            );
        },

        onError: (err: any) => {
            toast.error(
                err.message ||
                'Failed to apply moderation action'
            );
        },
    });
};