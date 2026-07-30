export enum MessageType {
    Text = 'text',
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    File = 'file',
    Location = 'location',
    System = 'system',
}

export enum MessageStatus {
    Sent = 'sent',
    Delivered = 'delivered',
    Read = 'read',
    Deleted = 'deleted',
}

export interface IMessage {
    /** Firestore Document ID */
    id: string;

    /** Conversation */
    conversationId: string;

    /** Sender */
    senderId: string;
    senderName: string;

    /** Content */
    message?: string;
    type: MessageType;

    /** Media */
    mediaUrl?: string;
    thumbnailUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;

    /** Reply */
    replyToMessageId?: string;

    /** Delivery */
    deliveredTo?: string[];
    readBy?: string[];

    /** Status */
    status: MessageStatus;

    /** Flags */
    isEdited: boolean;
    isDeleted: boolean;

    /** Extra Data */
    metadata?: Record<string, any>;

    /** Audit */
    createdAt: Date;
    updatedAt?: Date;
}