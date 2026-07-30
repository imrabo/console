import { apiClient } from '@/lib/api/client';
import {
    CreateModerationFormValues,
    EditModerationFormValues,
} from '../schemas';
import {
    ModerationAction,
    ModerationStatus,
    ModerationType,
} from '../types';

export const moderationService = {
    async fetchModerationCases() {
        return apiClient.get<ModerationType[]>('/moderations');
    },

    async fetchModerationCaseById(id: string) {
        return apiClient.get<ModerationType>(`/moderations?id=${id}`);
    },

    async createModerationCase(data: CreateModerationFormValues) {
        return apiClient.post<ModerationType>('/moderations', data);
    },

    async updateModerationCase(
        id: string,
        data: Partial<EditModerationFormValues>
    ) {
        return apiClient.patch<ModerationType>('/moderations', {
            id,
            ...data,
        });
    },

    async deleteModerationCase(id: string) {
        return apiClient.delete<void>(`/moderations?id=${id}`);
    },

    async updateModerationStatus(id: string, status: ModerationStatus) {
        return apiClient.patch<ModerationType>('/moderations', {
            id,
            status,
        });
    },

    async assignModerator(id: string, assignedModeratorId: string) {
        return apiClient.patch<ModerationType>('/moderations', {
            id,
            assignedModeratorId,
        });
    },

    async takeAction(
        id: string,
        action: ModerationAction,
        moderatorNote?: string
    ) {
        return apiClient.patch<ModerationType>('/moderations', {
            id,
            action,
            moderatorNote,
        });
    },
};

export default moderationService;