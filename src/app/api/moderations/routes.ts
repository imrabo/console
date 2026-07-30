import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { verifySession } from '@/lib/auth/session';



import { moderationRepository } from '@/features/moderation/repository/moderation.repository';
import { createModerationSchema, editModerationSchema } from '@/features/moderation/schemas';

export async function GET() {
    try {
        const session = await verifySession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const moderationCases =
            await moderationRepository.findAll();

        return NextResponse.json(moderationCases);
    } catch (error) {
        console.error(
            'Failed to fetch moderation cases:',
            error
        );

        return NextResponse.json(
            {
                error: 'Failed to fetch moderation cases',
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await verifySession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const data = createModerationSchema.parse(body);

        const moderationCase =
            await moderationRepository.create({
                entityType: data.entityType,
                entityId: data.entityId,
                reportedById: data.reportedById,
                ownerId: data.ownerId,
                reason: data.reason,
            });

        return NextResponse.json(
            moderationCase,
            {
                status: 201,
            }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    issues: error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        console.error(
            'Failed to create moderation case:',
            error
        );

        return NextResponse.json(
            {
                error: 'Failed to create moderation case',
            },
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await verifySession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const { id, ...payload } = body;

        if (!id) {
            return NextResponse.json(
                {
                    error: 'Moderation case ID is required',
                },
                {
                    status: 400,
                }
            );
        }

        const data =
            editModerationSchema.parse(payload);

        const moderationCase =
            await moderationRepository.update(
                id,
                data
            );

        return NextResponse.json(
            moderationCase
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    issues: error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        console.error(
            'Failed to update moderation case:',
            error
        );

        return NextResponse.json(
            {
                error: 'Failed to update moderation case',
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await verifySession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    error: 'Moderation case ID is required',
                },
                {
                    status: 400,
                }
            );
        }

        await moderationRepository.delete(id);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            'Failed to delete moderation case:',
            error
        );

        return NextResponse.json(
            {
                error: 'Failed to delete moderation case',
            },
            {
                status: 500,
            }
        );
    }
}