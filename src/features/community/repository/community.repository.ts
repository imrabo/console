import { ICommunity } from '../types';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { firestoreService } from '@/lib/firebase/admin-firestore';

class CommunitiesRepository {
    async findAll(): Promise<ICommunity[]> {
        return firestoreService.getDocuments<ICommunity>(
            COLLECTIONS.COMMUNITIES
        );
    }

    async findById(id: string): Promise<ICommunity | null> {
        return firestoreService.getDocument<ICommunity>(
            COLLECTIONS.COMMUNITIES,
            id
        );
    }

    async create(
        data: Omit<ICommunity, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<ICommunity> {
        return firestoreService.addDocument<ICommunity>(
            COLLECTIONS.COMMUNITIES,
            {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
    }

    async update(
        id: string,
        data: Partial<ICommunity>
    ): Promise<ICommunity> {
        return firestoreService.updateDocument<ICommunity>(
            COLLECTIONS.COMMUNITIES,
            id,
            {
                ...data,
                updatedAt: new Date(),
            }
        );
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.COMMUNITIES,
            id
        );
    }

    async findByStatus(status: ICommunity['status']): Promise<ICommunity[]> {
        return firestoreService.getDocumentsByField<ICommunity>(
            COLLECTIONS.COMMUNITIES,
            'status',
            status
        );
    }

    async findByCategory(category: string): Promise<ICommunity[]> {
        return firestoreService.getDocumentsByField<ICommunity>(
            COLLECTIONS.COMMUNITIES,
            'category',
            category
        );
    }


    async incrementMembers(id: string, amount = 1): Promise<ICommunity> {
        await firestoreService.incrementField(
            COLLECTIONS.COMMUNITIES,
            id,
            'memberCount',
            amount
        );

        const community = await this.findById(id);

        if (!community) {
            throw new Error('Community not found');
        }

        return community;
    }
}

export const communitiesRepository = new CommunitiesRepository();