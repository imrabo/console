import { z } from 'zod';

import {
  ICommunityAccessType,
  ICommunityStatus,
  ICommunityType,
  ICommunityVisibility,
} from '../types';

export const createCommunitySchema = z.object({
  name: z.string().min(2),
  description: z.string().max(2_000).optional(),
  type: z.nativeEnum(ICommunityType).default(ICommunityType.Family),
  category: z.string().min(1).optional(),
  accessType: z.nativeEnum(ICommunityAccessType).default(ICommunityAccessType.Free),
  price: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  userIds: z.array(z.string()).default([]),
  memberCount: z.number().int().nonnegative().default(0),
  adminId: z.string().min(1),
  adminIds: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  iconUrl: z.string().url().optional(),
  visibility: z.nativeEnum(ICommunityVisibility).default(ICommunityVisibility.Public),
  status: z.nativeEnum(ICommunityStatus).default(ICommunityStatus.Active),
});

export const updateCommunitySchema = createCommunitySchema.partial();

export type CreateCommunityDTO = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityDTO = z.infer<typeof updateCommunitySchema>;
