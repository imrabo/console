export enum ICommunityType {
    Announcements = 'announcements',
    Family = 'family',
    Homeschooling = 'homeschooling',
}

export enum ICommunityAccessType {
    Free = 'free',
    Paid = 'paid',
    InviteOnly = 'invite_only',
}

export enum ICommunityVisibility {
    Public = 'public',
    Private = 'private',
}

export enum ICommunityStatus {
    Active = 'active',
    Archived = 'archived',
    Deleted = 'deleted',
}

export interface ICommunity {
    /** Firestore Document ID */
    id: string;

    /** Basic Information */
    name: string;
    description?: string;

    /** Group Classification */
    type: ICommunityType;
    category?: string;

    /** Membership */
    accessType: ICommunityAccessType;
    price?: number;
    currency?: string;

    /** Members */
    userIds: string[];
    memberCount: number;

    /** Admins */
    adminId: string;
    adminIds?: string[];

    /** Media */
    imageUrl?: string;
    coverImageUrl?: string;
    iconUrl?: string;

    /** Visibility */
    visibility: ICommunityVisibility;

    /** Status */
    status: ICommunityStatus;

    /** Audit */
    createdByAdminId?: string;
    createdAt: Date;
    updatedAt?: Date;
}