import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { firestoreService } from '@/lib/firebase/admin-firestore';

import {
    ModerationCreateData,
    ModerationType,
    ModerationAction,
    ModerationStatus,
} from '../types';

class ModerationRepository {
    async findAll(): Promise<ModerationType[]> {
        return firestoreService.getDocuments<ModerationType>(
            COLLECTIONS.MODERATION_CASES
        );
    }

    async findById(id: string): Promise<ModerationType | null> {
        return firestoreService.getDocument<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            id
        );
    }

    async create(
        data: ModerationCreateData
    ): Promise<ModerationType> {
        return firestoreService.addDocument<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            {
                ...data,
                status: ModerationStatus.PENDING,
                action: ModerationAction.NONE,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Omit<ModerationType, 'id'>
        );
    }

    async update(
        id: string,
        data: Partial<Omit<ModerationType, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<ModerationType> {
        return firestoreService.updateDocument<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            id,
            {
                ...data,
                updatedAt: new Date(),
            }
        );
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.MODERATION_CASES,
            id
        );
    }

    async updateStatus(
        id: string,
        status: ModerationStatus
    ): Promise<ModerationType> {
        return firestoreService.updateDocument<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            id,
            {
                status,
                updatedAt: new Date(),
            }
        );
    }

    async assignModerator(
        id: string,
        assignedModeratorId: string
    ): Promise<ModerationType> {
        return firestoreService.updateDocument<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            id,
            {
                assignedModeratorId,
                updatedAt: new Date(),
            }
        );
    }

    async takeAction(
        id: string,
        action: ModerationAction,
        moderatorNote?: string
    ): Promise<ModerationType> {
        return firestoreService.updateDocument<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            id,
            {
                action,
                moderatorNote,
                status: ModerationStatus.RESOLVED,
                updatedAt: new Date(),
            }
        );
    }

    async findByStatus(
        status: ModerationStatus
    ): Promise<ModerationType[]> {
        return firestoreService.getDocumentsByField<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            'status',
            status
        );
    }

    async findByEntity(
        entityId: string
    ): Promise<ModerationType[]> {
        return firestoreService.getDocumentsByField<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            'entityId',
            entityId
        );
    }

    async findByModerator(
        assignedModeratorId: string
    ): Promise<ModerationType[]> {
        return firestoreService.getDocumentsByField<ModerationType>(
            COLLECTIONS.MODERATION_CASES,
            'assignedModeratorId',
            assignedModeratorId
        );
    }
}

export const moderationRepository = new ModerationRepository();