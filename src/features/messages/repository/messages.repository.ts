import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import { firestoreService } from '@/lib/firebase/admin-firestore';

import {
    IMessage,
    MessageStatus,
    MessageType,
} from '../types';
import { CreateMessageInput } from '../schemas/messages.schema';

class MessagesRepository {
    // --------------------------------------------------------------------------
    // Messages
    // --------------------------------------------------------------------------

    async findAll(): Promise<IMessage[]> {
        return firestoreService.getDocuments<IMessage>(
            COLLECTIONS.MESSAGES
        );
    }

    async findById(id: string): Promise<IMessage | null> {
        return firestoreService.getDocument<IMessage>(
            COLLECTIONS.MESSAGES,
            id
        );
    }

    async findByConversation(
        conversationId: string
    ): Promise<IMessage[]> {
        return firestoreService.getDocumentsByField<IMessage>(
            COLLECTIONS.MESSAGES,
            'conversationId',
            conversationId
        );
    }

    async findBySender(
        senderId: string
    ): Promise<IMessage[]> {
        return firestoreService.getDocumentsByField<IMessage>(
            COLLECTIONS.MESSAGES,
            'senderId',
            senderId
        );
    }


    async create(
        data: CreateMessageInput
    ): Promise<IMessage> {
        return firestoreService.addDocument<IMessage>(
            COLLECTIONS.MESSAGES,
            {
                ...data,
                status: MessageStatus.Sent,
                deliveredTo: [],
                readBy: [],
                isEdited: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
    }

    async update(
        id: string,
        data: Partial<IMessage>
    ): Promise<IMessage> {
        return firestoreService.updateDocument<IMessage>(
            COLLECTIONS.MESSAGES,
            id,
            {
                ...data,
                updatedAt: new Date(),
            }
        );
    }

    async delete(id: string): Promise<void> {
        return firestoreService.deleteDocument(
            COLLECTIONS.MESSAGES,
            id
        );
    }

    // --------------------------------------------------------------------------
    // Message Status
    // --------------------------------------------------------------------------

    async markDelivered(
        id: string,
        userId: string
    ): Promise<IMessage> {
        const message = await this.findById(id);

        if (!message) {
            throw new Error('Message not found');
        }

        const deliveredTo = Array.from(
            new Set([...(message.deliveredTo ?? []), userId])
        );

        return this.update(id, {
            deliveredTo,
            status: MessageStatus.Delivered,
        });
    }

    async markRead(
        id: string,
        userId: string
    ): Promise<IMessage> {
        const message = await this.findById(id);

        if (!message) {
            throw new Error('Message not found');
        }

        const readBy = Array.from(
            new Set([...(message.readBy ?? []), userId])
        );

        return this.update(id, {
            readBy,
            status: MessageStatus.Read,
        });
    }

    async softDelete(id: string): Promise<IMessage> {
        return this.update(id, {
            isDeleted: true,
            status: MessageStatus.Deleted,
            message: 'This message was deleted.',
        });
    }

    async editMessage(
        id: string,
        message: string
    ): Promise<IMessage> {
        return this.update(id, {
            message,
            isEdited: true,
        });
    }

    // --------------------------------------------------------------------------
    // Media
    // --------------------------------------------------------------------------

    async findMediaMessages(
        conversationId: string
    ): Promise<IMessage[]> {
        const messages = await this.findByConversation(
            conversationId
        );

        return messages.filter((m) =>
            [
                MessageType.Image,
                MessageType.Video,
                MessageType.Audio,
                MessageType.File,
            ].includes(m.type)
        );
    }

    // --------------------------------------------------------------------------
    // Stats
    // --------------------------------------------------------------------------

    async getStats(conversationId: string) {
        const messages = await this.findByConversation(
            conversationId
        );

        return {
            totalMessages: messages.length,

            textMessages: messages.filter(
                (m) => m.type === MessageType.Text
            ).length,

            mediaMessages: messages.filter((m) =>
                [
                    MessageType.Image,
                    MessageType.Video,
                    MessageType.Audio,
                    MessageType.File,
                ].includes(m.type)
            ).length,

            deletedMessages: messages.filter(
                (m) => m.isDeleted
            ).length,

            editedMessages: messages.filter(
                (m) => m.isEdited
            ).length,

            latestMessage:
                messages.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )[0] ?? null,
        };
    }
}

export const messagesRepository =
    new MessagesRepository();