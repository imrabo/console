import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { adminUserFormSchema } from '@/features/admins';
import { adminUsersRepository } from '@/features/admins/repository/admin.users.repository';


export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json(await adminUsersRepository.findAll());
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const input = adminUserFormSchema.parse(await request.json());
  return NextResponse.json(await adminUsersRepository.create(input), { status: 201 });
}
