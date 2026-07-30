import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const payload = await request.json();
  const updatedAt = new Date().toISOString();

  await adminDb
    .collection('meetups')
    .doc(id)
    .update({ ...payload, updatedAt });
  const updated = await adminDb.collection('meetups').doc(id).get();
  return NextResponse.json({ id: updated.id, ...updated.data() });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  await adminDb.collection('meetups').doc(id).delete();
  return NextResponse.json({ ok: true });
}
