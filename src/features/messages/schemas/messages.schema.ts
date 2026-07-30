import { z } from 'zod';
import { MessageStatus, MessageType } from '../types';



export const MessageTypeSchema = z.enum(MessageType);
export const MessageStatusSchema = z.enum(MessageStatus);

export const MessageSchema = z
    .object({
        /** Firestore Document ID */
        id: z.string(),

        /** Conversation */
        conversationId: z.string().min(1, 'Conversation is required'),

        /** Sender */
        senderId: z.string().min(1, 'Sender is required'),

        /** Content */
        message: z
            .string()
            .max(5000, 'Message cannot exceed 5000 characters')
            .optional(),

        type: MessageTypeSchema,

        /** Media */
        mediaUrl: z.string().url().optional(),
        thumbnailUrl: z.string().url().optional(),

        fileName: z
            .string()
            .max(255, 'File name is too long')
            .optional(),

        fileSize: z
            .number()
            .nonnegative('File size must be positive')
            .optional(),

        mimeType: z.string().optional(),

        /** Reply */
        replyToMessageId: z.string().optional(),

        /** Delivery */
        deliveredTo: z.array(z.string()).default([]),

        readBy: z.array(z.string()).default([]),

        /** Status */
        status: MessageStatusSchema.default(MessageStatus.Sent),

        /** Flags */
        isEdited: z.boolean().default(false),

        isDeleted: z.boolean().default(false),

        /** Extra Data */
        metadata: z.record(z.string(), z.any()).optional(),

        /** Audit */
        createdAt: z.string(),

        updatedAt: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // Text messages require message body
        if (data.type === 'text' && !data.message?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['message'],
                message: 'Message is required for text messages.',
            });
        }

        // Media messages require mediaUrl
        if (
            ['image', 'video', 'audio', 'file'].includes(data.type) &&
            !data.mediaUrl
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['mediaUrl'],
                message: 'Media URL is required for media messages.',
            });
        }
    });

export type MessageFormData = z.infer<typeof MessageSchema>;

export const createMessageSchema = z
    .object({
        conversationId: z.string().min(1),

        senderId: z.string().min(1),

        senderName: z.string().min(1),

        message: z
            .string()
            .max(5000)
            .optional(),

        type: MessageTypeSchema,

        mediaUrl: z.string().url().optional(),

        thumbnailUrl: z.string().url().optional(),

        fileName: z.string().optional(),

        fileSize: z.number().optional(),

        mimeType: z.string().optional(),

        replyToMessageId: z.string().optional(),

        metadata: z.record(z.string(), z.any()).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === 'text' && !data.message?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['message'],
                message: 'Message is required.',
            });
        }

        if (
            ['image', 'video', 'audio', 'file'].includes(data.type) &&
            !data.mediaUrl
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['mediaUrl'],
                message: 'Media URL is required.',
            });
        }
    });

export type CreateMessageInput =
    z.infer<typeof createMessageSchema>;