import * as z from 'zod';
import { ModerationAction, ModerationEntityType, ModerationStatus } from '../types';



export const moderationFormSchema = z.object({
    entityType: z.nativeEnum(ModerationEntityType),

    entityId: z
        .string()
        .min(1, 'Entity ID is required'),

    reportedById: z
        .string()
        .min(1, 'Reporter is required'),

    ownerId: z
        .string()
        .min(1, 'Owner is required'),

    assignedModeratorId: z
        .string()
        .optional(),

    reason: z
        .string()
        .min(5, 'Reason is required')
        .max(500, 'Reason cannot exceed 500 characters'),

    status: z.nativeEnum(ModerationStatus),

    action: z.nativeEnum(ModerationAction),

    moderatorNote: z
        .string()
        .max(1000, 'Note cannot exceed 1000 characters')
        .optional(),
});

export const createModerationSchema =
    moderationFormSchema.extend({
        status: z
            .nativeEnum(ModerationStatus)
            .default(ModerationStatus.PENDING),

        action: z
            .nativeEnum(ModerationAction)
            .default(ModerationAction.NONE),

        assignedModeratorId: z.string().optional(),

        moderatorNote: z.string().optional(),
    });

export const editModerationSchema =
    moderationFormSchema.partial();

export type ModerationFormValues = z.infer<
    typeof moderationFormSchema
>;

export type CreateModerationFormValues = z.infer<
    typeof createModerationSchema
>;

export type EditModerationFormValues = z.infer<
    typeof editModerationSchema
>;