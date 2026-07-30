export enum ModerationEntityType {
    USER = 'user',
    GROUP = 'group',
    GROUP_POST = 'group_post',
    FEED_POST = 'feed_post',
    FEED_COMMENT = 'feed_comment',
    ANNOUNCEMENT = 'announcement',
    MEETUP = 'meetup',
    WEBINAR = 'webinar',
}

export enum ModerationStatus {
    PENDING = 'pending',
    REVIEWING = 'reviewing',
    RESOLVED = 'resolved',
    REJECTED = 'rejected',
}

export enum ModerationAction {
    NONE = 'none',
    WARNING = 'warning',
    REMOVE = 'remove',
    SUSPEND = 'suspend',
    BAN = 'ban',
}


export interface ModerationType {
    id: string;

    entityType: ModerationEntityType;
    entityId: string;

    reportedById: string;
    ownerId: string;

    assignedModeratorId?: string;

    reason: string;

    status: ModerationStatus;
    action: ModerationAction;

    moderatorNote?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface ModerationFilters {
    search?: string;
    entityType?: ModerationEntityType;
    status?: ModerationStatus;
    action?: ModerationAction;
    assignedModeratorId?: string;
}

export interface ModerationCreateData {
    entityType: ModerationEntityType;
    entityId: string;

    reportedById: string;
    ownerId: string;

    reason: string;
}

export interface ModerationUpdateData {
    assignedModeratorId?: string;

    status?: ModerationStatus;
    action?: ModerationAction;

    moderatorNote?: string;

    updatedAt?: Date;
}