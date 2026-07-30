import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';
import { createRegistrationSchema, registrationQuerySchema } from '@/features/webinars/schemas';
import { RegistrationQueryParams } from '@/features/webinars/schemas';
import { FieldValue } from 'firebase-admin/firestore';
import { Webinar } from '@/features/webinars';
import { DocumentData } from 'firebase/firestore';

// GET all registrations with filtering
export async function GET(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const params: Partial<RegistrationQueryParams> = {
    registrationStatus: searchParams.get('registrationStatus') as any,
    paymentStatus: searchParams.get('paymentStatus') as any,
    certificateIssued: searchParams.get('certificateIssued') === 'true',
    limit: parseInt(searchParams.get('limit') || '10'),
    page: parseInt(searchParams.get('page') || '1'),
  };

  let query: DocumentData = adminDb.collection('webinarRegistrations');

  // Apply filters
  if (params.webinarId) {
    query = query.where('webinarId', '==', params.webinarId);
  }
  if (params.userId) {
    query = query.where('userId', '==', params.userId);
  }
  if (params.registrationStatus) {
    query = query.where('registrationStatus', '==', params.registrationStatus);
  }
  if (params.paymentStatus) {
    query = query.where('paymentStatus', '==', params.paymentStatus);
  }
  if (params.certificateIssued !== undefined) {
    query = query.where('certificateIssued', '==', params.certificateIssued);
  }

  const snapshot = await query.get();
  const registrations = snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...doc.data() }));

  // Apply pagination
  const start = (params.page! - 1) * params.limit!;
  const end = start + params.limit!;
  const paginatedRegistrations = registrations.slice(start, end);

  return NextResponse.json({
    data: paginatedRegistrations,
    total: registrations.length,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(registrations.length / params.limit!),
  });
}

// POST - Create new registration
export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();

  // Validate payload
  const validation = createRegistrationSchema.safeParse(payload);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const registrationData = {
    ...payload,
    registeredAt: now,
    createdAt: now,
    updatedAt: now,
    attendanceDuration: 0,
    certificateIssued: false,
    feedbackSubmitted: false,
    reminderSent: false,
  };

  // Verify webinar exists and can accept registrations
  const webinarSnapshot = await adminDb.collection('webinars').doc(payload.webinarId).get();
  if (!webinarSnapshot.exists) {
    return NextResponse.json({ error: 'Webinar not found' }, { status: 404 });
  }

  const webinar: Webinar = webinarSnapshot.data() as Webinar;

  // Validate webinar can accept registrations
  if (!webinar.isActive) {
    return NextResponse.json(
      { error: 'Webinar is not currently available for registration' },
      { status: 400 }
    );
  }

  if (webinar.status === 'cancelled') {
    return NextResponse.json({ error: 'Webinar has been cancelled' }, { status: 400 });
  }

  if (webinar.status === 'completed') {
    return NextResponse.json({ error: 'Webinar has already been completed' }, { status: 400 });
  }

  // Check capacity
  if (webinar.maxParticipants && webinar.registeredCount >= webinar.maxParticipants) {
    return NextResponse.json({ error: 'Webinar has reached maximum capacity' }, { status: 400 });
  }

  // For paid webinars, ensure payment is handled
  if (webinar.isPaid && payload.paymentStatus === 'not_required') {
    return NextResponse.json({ error: 'Payment is required for this webinar' }, { status: 400 });
  }

  // Create registration
  const ref = await adminDb.collection('webinarRegistrations').add(registrationData);
  const created = await ref.get();

  // Increment registration count on webinar
  await adminDb
    .collection('webinars')
    .doc(payload.webinarId)
    .update({
      registeredCount: FieldValue.increment(1),
      updatedAt: now,
    });

  return NextResponse.json({ id: created.id, ...created.data() }, { status: 201 });
}
