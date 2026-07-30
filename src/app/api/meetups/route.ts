import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snapshot = await adminDb.collection('meetups').get();
  const meetups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(meetups);
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const now = new Date().toISOString();
  const ref = await adminDb.collection('meetups').add({
    ...payload,
    registrationsCount: payload.registrationsCount ?? 0,
    waitlistCount: payload.waitlistCount ?? 0,
    status: payload.status ?? 'Active',
    createdAt: now,
    updatedAt: now,
  });

  const created = await ref.get();
  return NextResponse.json({ id: created.id, ...created.data() }, { status: 201 });
}
