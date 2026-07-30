// app/api/messages/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { messagesRepository } from '@/features/messages/repository/messages.repository';


import {
    IMessage,
    MessageStatus,
    MessageType,
} from '@/features/messages/types';
import { createMessageSchema } from '@/features/messages/schemas/messages.schema';

interface MessageFilters {
    conversationId?: string;
    senderId?: string;
    type?: MessageType;
    status?: MessageStatus;
    isDeleted?: boolean;
    search?: string;
    mediaOnly?: boolean;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filters: MessageFilters = {
            conversationId: searchParams.get('conversationId') || undefined,
            senderId: searchParams.get('senderId') || undefined,
            type: (searchParams.get('type') as MessageType) || undefined,
            status: (searchParams.get('status') as MessageStatus) || undefined,
            search: searchParams.get('search') || undefined,
            mediaOnly:
                searchParams.get('mediaOnly') === 'true'
                    ? true
                    : undefined,
            isDeleted:
                searchParams.get('isDeleted') !== null
                    ? searchParams.get('isDeleted') === 'true'
                    : undefined,
        };

        let messages: IMessage[];

        // Prefer repository methods when possible
        if (filters.conversationId) {
            messages = await messagesRepository.findByConversation(
                filters.conversationId
            );
        } else if (filters.senderId) {
            messages = await messagesRepository.findBySender(
                filters.senderId
            );
        } else {
            messages = await messagesRepository.findAll();
        }

        // -----------------------------
        // Search
        // -----------------------------

        if (filters.search) {
            const term = filters.search.toLowerCase();

            messages = messages.filter((message) =>
                (message.message ?? '')
                    .toLowerCase()
                    .includes(term)
            );
        }

        // -----------------------------
        // Type
        // -----------------------------

        if (filters.type) {
            messages = messages.filter(
                (message) => message.type === filters.type
            );
        }

        // -----------------------------
        // Status
        // -----------------------------

        if (filters.status) {
            messages = messages.filter(
                (message) => message.status === filters.status
            );
        }

        // -----------------------------
        // Deleted
        // -----------------------------

        if (filters.isDeleted !== undefined) {
            messages = messages.filter(
                (message) =>
                    message.isDeleted === filters.isDeleted
            );
        }

        // -----------------------------
        // Media Only
        // -----------------------------

        if (filters.mediaOnly) {
            messages = messages.filter((message) =>
                [
                    MessageType.Image,
                    MessageType.Video,
                    MessageType.Audio,
                    MessageType.File,
                ].includes(message.type)
            );
        }

        return NextResponse.json(messages);
    } catch (error: any) {
        return NextResponse.json(
            {
                error:
                    error.message ??
                    'Failed to fetch messages',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const input = createMessageSchema.parse(
            await request.json()
        );

        const message = await messagesRepository.create(input);

        return NextResponse.json(message, {
            status: 201,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || 'Failed to create message',
            },
            { status: 500 }
        );
    }
}