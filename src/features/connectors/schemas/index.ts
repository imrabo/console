import * as zod from 'zod';
import { ResourceCategoryEnum, ResourceFileTypeEnum } from '../types/resources.types';

// Schema for creating a new resource
export const createResourceSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  description: zod.string().min(10, 'Description must be at least 10 characters'),
  category: zod
    .nativeEnum(ResourceCategoryEnum)
    .refine((val) => Object.values(ResourceCategoryEnum).includes(val as ResourceCategoryEnum), {
      message: 'Please select a valid category',
    }),
  fileType: zod
    .nativeEnum(ResourceFileTypeEnum)
    .refine((val) => Object.values(ResourceFileTypeEnum).includes(val as ResourceFileTypeEnum), {
      message: 'Please specify a valid file type',
    }),
  thumbnail: zod.string().url('Please enter a valid thumbnail URL'),
  url: zod.string().url('Please enter a valid resource URL'),
  isPremium: zod.boolean().default(false),
  creatorId: zod.string().min(1, 'Creator ID is required'),
});

// Schema for updating an existing resource
export const updateResourceSchema = createResourceSchema.partial();

// Schema for resource filters
export const resourceFiltersSchema = zod.object({
  search: zod.string().optional(),
  category: zod.nativeEnum(ResourceCategoryEnum).optional(),
  fileType: zod.nativeEnum(ResourceFileTypeEnum).optional(),
  isPremium: zod.boolean().optional(),
  creatorId: zod.string().optional(),
  minDownloads: zod.number().int().nonnegative().optional(),
  maxDownloads: zod.number().int().nonnegative().optional(),
});

// Legacy schema for file resources (backward compatibility)
export const createFileResourceSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  category: zod.string().min(1, 'Please select a category'),
  fileType: zod.string().min(1, 'Please specify file extension (e.g. PDF)'),
  fileSize: zod.string().min(1, 'Please enter file size (e.g. 2.4MB)'),
});

// Schema for store products
export const createProductSchema = zod.object({
  title: zod.string().min(3, 'Product title is required'),
  description: zod.string().min(5, 'Product description is required'),
  priceCoins: zod.coerce.number().min(1, 'Price must be at least 1 coin'),
  status: zod.enum(['Active', 'Inactive']).default('Active'),
  thumbnailUrl: zod
    .string()
    .url('Please enter a valid product preview image URL')
    .optional()
    .or(zod.literal('')),
});

// Type exports
export type CreateResourceFormValues = zod.infer<typeof createResourceSchema>;
export type UpdateResourceFormValues = zod.infer<typeof updateResourceSchema>;
export type ResourceFiltersFormValues = zod.infer<typeof resourceFiltersSchema>;
export type CreateFileResourceFormValues = zod.infer<typeof createFileResourceSchema>;
export type CreateProductFormValues = zod.infer<typeof createProductSchema>;
