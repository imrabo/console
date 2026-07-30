import { z } from 'zod';
import { FeedMediaType, FeedVisibility } from '../types';

/* -------------------------------------------------------------------------- */
/* Enums */
/* -------------------------------------------------------------------------- */

export const feedMediaTypeEnum = z.nativeEnum(FeedMediaType);
export const feedVisibilityEnum = z.nativeEnum(FeedVisibility);

/* -------------------------------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------------------------------- */

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional()
);

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url('Invalid URL').optional()
);

/* -------------------------------------------------------------------------- */
/* Base Schema */
/* -------------------------------------------------------------------------- */

export const feedPostBaseSchema = z.object({
  userId: z.string().min(1, 'User is required'),

  groupId: z.string().optional()
  ,

  thumbnailUrl: z.string().url().optional()
  ,

  isAnonymous: z.boolean(),

  content: z
    .string()
    .trim()
    .min(1, 'Content is required')
    .max(5000, 'Content cannot exceed 5000 characters'),

  mediaType: feedMediaTypeEnum,

  mediaUrls: z.array(
    z.object({
      url: z.string().url()
    })
  ),



  visibility: feedVisibilityEnum,
});

/* -------------------------------------------------------------------------- */
/* Create */
/* -------------------------------------------------------------------------- */

export const createFeedPostSchema = feedPostBaseSchema.superRefine(
  (data, ctx) => {
    switch (data.mediaType) {
      case FeedMediaType.Image:
      case FeedMediaType.Video:
        if (data.mediaUrls.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['mediaUrls'],
            message: 'At least one media URL is required.',
          });
        }
        break;

      case FeedMediaType.Carousel:
        if (data.mediaUrls.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['mediaUrls'],
            message: 'Carousel requires at least 2 media items.',
          });
        }
        break;

      case FeedMediaType.Text:
        if (data.mediaUrls.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['mediaUrls'],
            message: 'Text posts cannot contain media.',
          });
        }
        break;
    }

    if (
      data.mediaType === FeedMediaType.Video &&
      !data.thumbnailUrl
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['thumbnailUrl'],
        message: 'Thumbnail is required for video posts.',
      });
    }

    if (
      data.visibility === FeedVisibility.Group &&
      !data.groupId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['groupId'],
        message: 'Group is required.',
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* Update */
/* -------------------------------------------------------------------------- */

export const updateFeedPostSchema =
  feedPostBaseSchema.partial().superRefine((data, ctx) => {
    if (
      data.mediaType === FeedMediaType.Image ||
      data.mediaType === FeedMediaType.Video
    ) {
      if (data.mediaUrls && data.mediaUrls.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['mediaUrls'],
          message: 'Media is required.',
        });
      }
    }

    if (
      data.mediaType === FeedMediaType.Carousel &&
      data.mediaUrls &&
      data.mediaUrls.length < 2
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mediaUrls'],
        message: 'Carousel requires at least 2 media items.',
      });
    }

    if (
      data.mediaType === FeedMediaType.Text &&
      data.mediaUrls &&
      data.mediaUrls.length > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mediaUrls'],
        message: 'Text posts cannot contain media.',
      });
    }

    if (
      data.visibility === FeedVisibility.Group &&
      data.groupId === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['groupId'],
        message: 'Group is required.',
      });
    }
  });

/* -------------------------------------------------------------------------- */
/* Query */
/* -------------------------------------------------------------------------- */

export const feedPostQuerySchema = z.object({
  visibility: feedVisibilityEnum.optional(),

  mediaType: feedMediaTypeEnum.optional(),

  userId: z.string().optional(),

  groupId: z.string().optional(),

  isAnonymous: z.boolean().optional(),

  limit: z.number().min(1).max(100).default(10),

  page: z.number().min(1).default(1),

  search: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

export type CreateFeedPostFormValues = z.output<typeof createFeedPostSchema>;

export type UpdateFeedPostFormValues = z.output<
  typeof updateFeedPostSchema
>;

export type FeedPostQueryParams = z.output<
  typeof feedPostQuerySchema
>;