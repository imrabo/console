import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

const schema = z.object({
  userId: z.string().min(1),
  membershipType: z.string().min(1),
  status: z.string().default('Active'),
});

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const input = schema.parse(await request.json());
  const updatedAt = new Date().toISOString();

  await adminDb.collection(COLLECTIONS.USERS).doc(input.userId).update({
    membershipType: input.membershipType,
    membershipStatus: input.status,
    updatedAt,
  });

  await adminDb.collection('auditLogs').add({
    adminId: session as string,
    action: 'UPDATE_MEMBERSHIP',
    target: input.userId,
    details: `${input.membershipType} (${input.status})`,
    createdAt: updatedAt,
  });

  return NextResponse.json({ ok: true });
}
