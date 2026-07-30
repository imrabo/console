import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';
import { createWebinarSchema } from '@/features/webinars/schemas';
import { WebinarQueryParams } from '@/features/webinars/schemas';
import { WebinarCategory, WebinarStatus } from '@/features/webinars';

export async function GET(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const params: Partial<WebinarQueryParams> = {
    status: searchParams.get('webinarStatus') as WebinarStatus,
    category: searchParams.get('category') as WebinarCategory,
    isFeatured: searchParams.get('isFeatured') === 'true',
    isActive: searchParams.get('isActive') === 'true',
    isPaid: searchParams.get('isPaid') === 'true',
    limit: parseInt(searchParams.get('limit') || '10'),
    page: parseInt(searchParams.get('page') || '1'),
  };

  const query = adminDb.collection('webinars');

  // Apply filters
  // if (params.status) {
  //   query = query.where('status', '==', params.status);
  // }
  // if (params.category) {
  //   query = query.where('category', '==', params.category);
  // }
  // if (params.isFeatured !== undefined) {
  //   query = query.where('isFeatured', '==', params.isFeatured);
  // }
  // if (params.isActive !== undefined) {
  //   query = query.where('isActive', '==', params.isActive);
  // }
  // if (params.isPaid !== undefined) {
  //   query = query.where('isPaid', '==', params.isPaid);
  // }

  const snapshot = await query.get();
  const webinars = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Apply pagination
  const start = (params.page! - 1) * params.limit!;
  const end = start + params.limit!;
  const paginatedWebinars = webinars.slice(start, end);

  return NextResponse.json({
    data: paginatedWebinars,
    total: webinars.length,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(webinars.length / params.limit!),
  });
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();

  // Validate payload
  const validation = createWebinarSchema.safeParse(payload);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const webinarData = {
    ...payload,
    registeredCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: session,
    updatedBy: session,
    // Ensure required fields have defaults
    thumbnailUrl: payload.thumbnailUrl || null,
    speakerImageUrl: payload.speakerImageUrl || null,
    speakerDesignation: payload.speakerDesignation || null,
    recordingUrl: payload.recordingUrl || null,
    meetingUrl: payload.meetingUrl || null,
    endAt: payload.endAt || null,
    maxParticipants: payload.maxParticipants || null,
  };

  const ref = await adminDb.collection('webinars').add(webinarData);
  const created = await ref.get();
  return NextResponse.json({ id: created.id, ...created.data() }, { status: 201 });
}
