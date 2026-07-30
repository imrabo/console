import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { firestoreService } from '@/lib/firebase/admin-firestore';


import { UserCreateData, UserType } from '../types';

class UsersRepository {
    async findAll(): Promise<UserType[]> {
        return firestoreService.getDocuments<UserType>(
            COLLECTIONS.USERS
        );
    }

    async findById(id: string): Promise<UserType | null> {
        return firestoreService.getDocument<UserType>(
            COLLECTIONS.USERS,
            id
        );
    }

    async create(data: UserCreateData): Promise<UserType> {
        return firestoreService.addDocument<UserType>(
            COLLECTIONS.USERS,
            {
                ...data,


                isActive: true,
                isExpert: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Omit<UserType, 'id'>
        );
    }

    async update(
        id: string,
        data: Partial<Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<UserType> {
        return firestoreService.updateDocument<UserType>(
            COLLECTIONS.USERS,
            id,
            {
                ...data,
                updatedAt: new Date().toISOString(),
            } as Partial<Omit<UserType, 'id' | 'createdAt' | 'updatedAt'>>
        );
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.USERS,
            id
        );
    }

    async updateStatus(
        id: string,
        status: UserType['status']
    ): Promise<UserType> {
        return firestoreService.updateDocument<UserType>(
            COLLECTIONS.USERS,
            id,
            {
                status,
                updatedAt: new Date(),
            }
        );
    }

    async updatePreferences(
        id: string,
        preferences: UserType['preferences']
    ): Promise<UserType> {
        return firestoreService.updateDocument<UserType>(
            COLLECTIONS.USERS,
            id,
            {
                preferences,
                updatedAt: new Date(),
            }
        );
    }

    async updateChildren(
        id: string,
        children: UserType['children']
    ): Promise<UserType> {
        return firestoreService.updateDocument<UserType>(
            COLLECTIONS.USERS,
            id,
            {
                children,
                updatedAt: new Date(),
            }
        );
    }

    async incrementCoins(
        id: string,
        amount: number
    ): Promise<UserType> {
        await firestoreService.incrementField(
            COLLECTIONS.USERS,
            id,
            'coins',
            amount
        );

        const user = await this.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async findByEmail(
        email: string
    ): Promise<UserType | null> {
        const users =
            await firestoreService.getDocumentsByField<UserType>(
                COLLECTIONS.USERS,
                'email',
                email
            );

        return users[0] ?? null;
    }

    async findByStatus(
        status: UserType['status']
    ): Promise<UserType[]> {
        return firestoreService.getDocumentsByField<UserType>(
            COLLECTIONS.USERS,
            'status',
            status
        );
    }
}

export const usersRepository = new UsersRepository();
