import { firestoreService } from '@/lib/firebase/admin-firestore';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

import {

    WebinarDocument,
    WebinarRegistrationDocument,
    CreateWebinarDTO,
    UpdateWebinarDTO,
    CreateWebinarRegistrationDTO,
    UpdateWebinarRegistrationDTO,
    WebinarCategory,
    WebinarStatus,
    RegistrationStatus,
    PaymentStatus,
    WebinarRegistration,
} from '../types';

class WebinarRegistrationRepository {

    // --------------------------------------------------------------------------
    // Registrations
    // --------------------------------------------------------------------------

    async findRegistrations(): Promise<WebinarRegistrationDocument[]> {
        return firestoreService.getDocuments<WebinarRegistrationDocument>(
            COLLECTIONS.WEBINAR_PARTICIPANTS
        );
    }

    async findRegistrationById(
        id: string
    ): Promise<WebinarRegistrationDocument | null> {
        return firestoreService.getDocument<WebinarRegistrationDocument>(
            COLLECTIONS.WEBINAR_PARTICIPANTS,
            id
        );
    }

    async createRegistration(
        data: CreateWebinarRegistrationDTO
    ): Promise<WebinarRegistration> {
        return firestoreService.addDocument<WebinarRegistration>(
            COLLECTIONS.WEBINAR_PARTICIPANTS,
            {
                ...data,
                registeredAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attendanceDuration: 0,
                certificateIssued: false,
                feedbackSubmitted: false,
                reminderSent: false,
            }
        );
    }

    async updateRegistration(
        id: string,
        data: UpdateWebinarRegistrationDTO
    ): Promise<WebinarRegistration> {
        return firestoreService.updateDocument<WebinarRegistration>(
            COLLECTIONS.WEBINAR_PARTICIPANTS,
            id,
            {
                ...data,
                updatedAt: new Date().toISOString(),
            }
        );
    }

    async deleteRegistration(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.WEBINAR_PARTICIPANTS,
            id
        );
    }

    // --------------------------------------------------------------------------
    // Queries
    // --------------------------------------------------------------------------

    async findByCategory(
        category: WebinarCategory
    ): Promise<WebinarDocument[]> {
        return firestoreService.getDocumentsByField<WebinarDocument>(
            COLLECTIONS.WEBINARS,
            'category',
            category
        );
    }

    async findByStatus(
        status: WebinarStatus
    ): Promise<WebinarDocument[]> {
        return firestoreService.getDocumentsByField<WebinarDocument>(
            COLLECTIONS.WEBINARS,
            'status',
            status
        );
    }

    async findRegistrationsByWebinar(
        webinarId: string
    ): Promise<WebinarRegistrationDocument[]> {
        return firestoreService.getDocumentsByField<WebinarRegistrationDocument>(
            COLLECTIONS.WEBINAR_PARTICIPANTS,
            'webinarId',
            webinarId
        );
    }

    async findRegistrationsByUser(
        userId: string
    ): Promise<WebinarRegistrationDocument[]> {
        return firestoreService.getDocumentsByField<WebinarRegistrationDocument>(
            COLLECTIONS.WEBINAR_PARTICIPANTS,
            'userId',
            userId
        );
    }




}

export const webinarsRepository = new WebinarRegistrationRepository();