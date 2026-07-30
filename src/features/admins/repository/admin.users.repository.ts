
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { firestoreService } from '@/lib/firebase/admin-firestore';
import { AdminUser, AdminUserFormData } from '../schemas';


class AdminUserRepository {
    async findAll(): Promise<AdminUser[]> {
        return firestoreService.getDocuments<AdminUser>(COLLECTIONS.ADMIN_USERS);
    }

    async findById(id: string): Promise<AdminUser | null> {
        return firestoreService.getDocument<AdminUser>(
            COLLECTIONS.ADMIN_USERS,
            id
        );
    }

    async create(data: AdminUserFormData): Promise<AdminUser> {
        return firestoreService.addDocument<AdminUser>(COLLECTIONS.ADMIN_USERS, {
            ...data,
            isActive: true,
            createdAt: new Date(),
        });
    }

    async update(id: string, data: Partial<AdminUserFormData>): Promise<AdminUser> {
        return firestoreService.updateDocument<AdminUser>(COLLECTIONS.ADMIN_USERS, id, data);
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(COLLECTIONS.ADMIN_USERS, id);
    }

}

export const adminUsersRepository = new AdminUserRepository();
