import { z } from 'zod';

export enum ComunityType {
    Announcements = 'announcements',
    Family = 'family',
    Homeschooling = 'homeschooling',
}

export enum ComunityAccessType {
    Free = 'free',
    Paid = 'paid',
    InviteOnly = 'invite_only',
}

export enum ComunityVisibility {
    Public = 'public',
    Private = 'private',
}

export enum ComunityStatus {
    Active = 'active',
    Archived = 'archived',
    Deleted = 'deleted',
}

export const ComunitySchema = z.object({
    /** Firestore Document ID */
    id: z.string().min(1),

    /** Basic Information */
    name: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),

    /** Group Classification */
    type: z.nativeEnum(ComunityType),
    category: z.string().max(100).optional(),

    /** Membership */
    accessType: z.nativeEnum(ComunityAccessType),
    price: z.number().nonnegative().optional(),
    currency: z.string().length(3).optional(), // ISO 4217 (e.g. INR, USD)

    /** Members */
    userIds: z.array(z.string()).default([]),
    memberCount: z.number().int().nonnegative(),

    /** Admins */
    adminId: z.string().min(1),
    adminIds: z.array(z.string()).optional(),

    /** Media */
    imageUrl: z.string().url().optional(),
    coverImageUrl: z.string().url().optional(),
    iconUrl: z.string().url().optional(),

    /** Visibility */
    visibility: z.nativeEnum(ComunityVisibility),

    /** Status */
    status: z.nativeEnum(ComunityStatus),

    /** Audit */
    createdByAdminId: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
});



export type Comunity = z.infer<typeof ComunitySchema>;