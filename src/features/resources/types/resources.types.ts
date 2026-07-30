/**
 * Resource type definitions based on ResourcesEntity model
 */

export interface Resource {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string;
  fileType: string;
  creatorId: string;
  downloads: number;
  isPremium: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ResourceFilters {
  search?: string;
  category?: string;
  fileType?: string;
  isPremium?: boolean;
  creatorId?: string;
  minDownloads?: number;
  maxDownloads?: number;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ResourceStats {
  totalResources: number;
  totalDownloads: number;
  mostPopularCategory: string;
  mostDownloadedResource: Resource | null;
  premiumResources: number;
  freeResources: number;
}

export type CreateResourceInput = Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'downloads'>;
export type UpdateResourceInput = Partial<Omit<Resource, 'id' | 'createdAt' | 'creatorId'>>;

// Re-export enums from resources.enums for backward compatibility
export {
  ResourceCategory as ResourceCategoryEnum,
  ResourceFileType as ResourceFileTypeEnum,
  ResourceStatus,
  ResourceVisibility,
  CATEGORY_OPTIONS,
  FILE_TYPE_OPTIONS,
  FILE_TYPE_MIME_MAP,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
} from './resources.enums';
