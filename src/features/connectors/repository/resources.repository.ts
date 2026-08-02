import {
    Resource,
    CreateResourceInput,
    UpdateResourceInput,
    ResourceStats,
} from '../types/resources.types';

import { ResourceFile, StoreProduct } from '../types';

import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { firestoreService } from '@/lib/firebase/admin-firestore';

class ResourcesRepository {
    // --------------------------------------------------------------------------
    // Resources
    // --------------------------------------------------------------------------

    async findAll(): Promise<Resource[]> {
        return firestoreService.getDocuments<Resource>(
            COLLECTIONS.RESOURCES
        );
    }

    async findById(id: string): Promise<Resource | null> {
        return firestoreService.getDocument<Resource>(
            COLLECTIONS.RESOURCES,
            id
        );
    }

    async create(data: CreateResourceInput): Promise<Resource> {
        return firestoreService.addDocument<Resource>(
            COLLECTIONS.RESOURCES,
            {
                ...data,
                downloads: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );
    }

    async update(
        id: string,
        data: UpdateResourceInput
    ): Promise<Resource> {
        return firestoreService.updateDocument<Resource>(
            COLLECTIONS.RESOURCES,
            id,
            {
                ...data,
                updatedAt: new Date().toISOString(),
            }
        );
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.RESOURCES,
            id
        );
    }

    async incrementDownloads(id: string): Promise<Resource> {
        await firestoreService.incrementField(
            COLLECTIONS.RESOURCES,
            id,
            'downloads',
            1
        );

        const resource = await this.findById(id);

        if (!resource) {
            throw new Error('Resource not found');
        }

        return resource;
    }

    async findByCreator(creatorId: string): Promise<Resource[]> {
        return firestoreService.getDocumentsByField<Resource>(
            COLLECTIONS.RESOURCES,
            'creatorId',
            creatorId
        );
    }

    async getRecent(limit = 10): Promise<Resource[]> {
        return firestoreService.getDocumentsOrdered<Resource>(
            COLLECTIONS.RESOURCES,
            'createdAt',
            limit,
            'desc'
        );
    }

    async getPopular(limit = 10): Promise<Resource[]> {
        return firestoreService.getDocumentsOrdered<Resource>(
            COLLECTIONS.RESOURCES,
            'downloads',
            limit,
            'desc'
        );
    }

    async getStats(): Promise<ResourceStats> {
        const resources = await this.findAll();
        const categoryCounts = resources.reduce<Record<string, number>>(
            (counts, resource) => {
                counts[resource.category] = (counts[resource.category] ?? 0) + 1;
                return counts;
            },
            {}
        );

        return {
            totalResources: resources.length,
            totalDownloads: resources.reduce(
                (sum, resource) => sum + (resource.downloads ?? 0),
                0
            ),
            mostPopularCategory:
                Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'None',
            mostDownloadedResource: resources.reduce<Resource | null>(
                (mostDownloaded, resource) =>
                    !mostDownloaded || resource.downloads > mostDownloaded.downloads
                        ? resource
                        : mostDownloaded,
                null
            ),
            premiumResources: resources.filter((resource) => resource.isPremium).length,
            freeResources: resources.filter((resource) => !resource.isPremium).length,
        };
    }

    // --------------------------------------------------------------------------
    // Resource Files (Legacy)
    // --------------------------------------------------------------------------

    async findFiles(): Promise<ResourceFile[]> {
        return firestoreService.getDocuments<ResourceFile>(
            COLLECTIONS.RESOURCES
        );
    }

    // --------------------------------------------------------------------------
    // Products
    // --------------------------------------------------------------------------

    async findProducts(): Promise<StoreProduct[]> {
        return firestoreService.getDocuments<StoreProduct>(
            'products'
        );
    }

    async findProductById(
        id: string
    ): Promise<StoreProduct | null> {
        return firestoreService.getDocument<StoreProduct>(
            'products',
            id
        );
    }

    async createProduct(
        data: Omit<
            StoreProduct,
            'id' | 'createdAt' | 'updatedAt' | 'salesCount'
        >
    ): Promise<StoreProduct> {
        return firestoreService.addDocument<StoreProduct>(
            'products',
            {
                ...data,
                salesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
    }

    async updateProduct(
        id: string,
        data: Partial<StoreProduct>
    ): Promise<StoreProduct> {
        return firestoreService.updateDocument<StoreProduct>(
            'products',
            id,
            {
                ...data,
                updatedAt: new Date(),
            }
        );
    }

    async deleteProduct(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            'products',
            id
        );
    }
}

export const resourcesRepository = new ResourcesRepository();
