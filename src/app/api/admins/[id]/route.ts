import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { adminUserFormSchema } from '@/features/admins';
import { adminUsersRepository } from '@/features/admins/repository/admin.users.repository';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  if (!(await adminUsersRepository.findById(id))) {
    return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
  }

  const payload = adminUserFormSchema.partial().parse(await request.json());
  return NextResponse.json(await adminUsersRepository.update(id, payload));
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  if (!(await adminUsersRepository.findById(id))) {
    return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
  }

  await adminUsersRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}
