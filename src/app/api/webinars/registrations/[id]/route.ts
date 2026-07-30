import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';
import { updateRegistrationSchema } from '@/features/webinars/schemas';
import { FieldValue } from 'firebase-admin/firestore';

// GET single registration
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const registrationSnapshot = await adminDb.collection('webinarRegistrations').doc(id).get();

  if (!registrationSnapshot.exists) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  const registration = { id: registrationSnapshot.id, ...registrationSnapshot.data() };
  return NextResponse.json(registration);
}

// PATCH - Update registration
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const payload = await request.json();

  // Validate payload
  const validation = updateRegistrationSchema.safeParse(payload);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.issues },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const updateData = {
    ...payload,
    updatedAt: now,
  };

  // Get current registration to check for changes
  const registrationSnapshot = await adminDb.collection('webinarRegistrations').doc(id).get();
  if (!registrationSnapshot.exists) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  // Update registration
  await adminDb.collection('webinarRegistrations').doc(id).update(updateData);
  const updated = await adminDb.collection('webinarRegistrations').doc(id).get();

  return NextResponse.json({ id: updated.id, ...updated.data() });
}

// DELETE - Remove registration
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;

  // Get registration to decrement webinar count
  const registrationSnapshot = await adminDb.collection('webinarRegistrations').doc(id).get();
  if (!registrationSnapshot.exists) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }

  const registration = { id: registrationSnapshot.id, ...registrationSnapshot.data() } as any;

  // Delete registration
  await adminDb.collection('webinarRegistrations').doc(id).delete();

  // Decrement registration count on webinar
  await adminDb
    .collection('webinars')
    .doc(registration.webinarId)
    .update({
      registeredCount: FieldValue.increment(-1),
      updatedAt: new Date().toISOString(),
    });

  return NextResponse.json({ ok: true });
}
