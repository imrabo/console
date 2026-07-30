export enum FeedMediaType {
    Text = 'text',
    Image = 'image',
    Video = 'video',
    Carousel = 'carousel',
}

export enum FeedVisibility {
    Public = 'public',
    Group = 'group',
    Private = 'private',
}

export enum FeedStatus {
    Active = 'active',
    Hidden = 'hidden',
    Reported = 'reported',
    Deleted = 'deleted',
}

export interface FeedPost {
    id: string;

    userId: string;
    groupId?: string;

    isAnonymous: boolean;
    content: string;

    mediaType: FeedMediaType;
    mediaUrls: string[];
    thumbnailUrl?: string;

    visibility: FeedVisibility;
    status: FeedStatus;

    likeCount: number;
    commentCount: number;
    shareCount: number;
    saveCount: number;
    viewCount: number;
    reportCount: number;

    createdAt: Date;
        updatedAt?: Date;
    deletedAt?: string;

    createdBy?: string;
    updatedBy?: string;
}

export interface CreateFeedPostRequest {
    userId: string;
    groupId?: string;

    isAnonymous: boolean;

    content: string;

    mediaType: FeedMediaType;
    mediaUrls: string[];
    thumbnailUrl?: string;

    visibility: FeedVisibility;

    createdBy?: string;
}

