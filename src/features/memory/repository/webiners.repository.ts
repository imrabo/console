import { firestoreService } from '@/lib/firebase/admin-firestore';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

import {
    Webinar,
    WebinarRegistration,
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
} from '../types';

class WebinarsRepository {
    // --------------------------------------------------------------------------
    // Webinars
    // --------------------------------------------------------------------------

    async findAll(): Promise<WebinarDocument[]> {
        return firestoreService.getDocuments<WebinarDocument>(
            COLLECTIONS.WEBINARS
        );
    }

    async findById(id: string): Promise<WebinarDocument | null> {
        return firestoreService.getDocument<WebinarDocument>(
            COLLECTIONS.WEBINARS,
            id
        );
    }

    async create(data: CreateWebinarDTO): Promise<Webinar> {
        return firestoreService.addDocument<Webinar>(
            COLLECTIONS.WEBINARS,
            {
                ...data,
                createdBy: '',
                status: data.status ?? WebinarStatus.Upcoming,
                registeredCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );
    }

    async update(
        id: string,
        data: UpdateWebinarDTO
    ): Promise<Webinar> {
        return firestoreService.updateDocument<Webinar>(
            COLLECTIONS.WEBINARS,
            id,
            {
                ...data,
                updatedAt: new Date().toISOString(),
            }
        );
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.WEBINARS,
            id
        );
    }

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

    // --------------------------------------------------------------------------
    // Counters
    // --------------------------------------------------------------------------

    async incrementRegistrationCount(
        webinarId: string,
        amount = 1
    ): Promise<WebinarDocument> {
        await firestoreService.incrementField(
            COLLECTIONS.WEBINARS,
            webinarId,
            'registeredCount',
            amount
        );

        const webinar = await this.findById(webinarId);

        if (!webinar) {
            throw new Error('Webinar not found');
        }

        return webinar;
    }

    // --------------------------------------------------------------------------
    // Analytics
    // --------------------------------------------------------------------------

    async getActiveCount(): Promise<number> {
        const webinars = await this.findAll();
        return webinars.filter(w => w.isActive).length;
    }

    async getFeatured(): Promise<WebinarDocument[]> {
        const webinars = await this.findAll();
        return webinars.filter(
            w => w.isFeatured && w.isActive
        );
    }

    async getUpcoming(): Promise<WebinarDocument[]> {
        const now = new Date();

        const webinars = await this.findAll();

        return webinars.filter(w => {
            return (
                new Date(w.scheduledAt) > now &&
                w.isActive
            );
        });
    }
}

export const webinarsRepository = new WebinarsRepository();
