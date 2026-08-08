import * as zod from 'zod';
import { ConnectorCategoryEnum, ConnectorFileTypeEnum } from '../types/connector.types';

// Schema for creating a new connector
export const createConnectorSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  description: zod.string().min(10, 'Description must be at least 10 characters'),
  category: zod
    .nativeEnum(ConnectorCategoryEnum)
    .refine((val) => Object.values(ConnectorCategoryEnum).includes(val as ConnectorCategoryEnum), {
      message: 'Please select a valid category',
    }),
  fileType: zod
    .nativeEnum(ConnectorFileTypeEnum)
    .refine((val) => Object.values(ConnectorFileTypeEnum).includes(val as ConnectorFileTypeEnum), {
      message: 'Please specify a valid file type',
    }),
  thumbnail: zod.string().url('Please enter a valid thumbnail URL'),
  url: zod.string().url('Please enter a valid connector URL'),
  isPremium: zod.boolean().default(false),
  creatorId: zod.string().min(1, 'Creator ID is required'),
});

// Schema for updating an existing connector
export const updateConnectorSchema = createConnectorSchema.partial();

// Schema for connector filters
export const resourceFiltersSchema = zod.object({
  search: zod.string().optional(),
  category: zod.nativeEnum(ConnectorCategoryEnum).optional(),
  fileType: zod.nativeEnum(ConnectorFileTypeEnum).optional(),
  isPremium: zod.boolean().optional(),
  creatorId: zod.string().optional(),
  minDownloads: zod.number().int().nonnegative().optional(),
  maxDownloads: zod.number().int().nonnegative().optional(),
});

// Legacy schema for file connectors (backward compatibility)
export const createFileConnectorSchema = zod.object({
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
export type CreateConnectorFormValues = zod.infer<typeof createConnectorSchema>;
export type UpdateConnectorFormValues = zod.infer<typeof updateConnectorSchema>;
export type ConnectorFiltersFormValues = zod.infer<typeof resourceFiltersSchema>;
export type CreateFileConnectorFormValues = zod.infer<typeof createFileConnectorSchema>;
export type CreateProductFormValues = zod.infer<typeof createProductSchema>;
