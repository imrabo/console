import { NextResponse } from 'next/server';

import { communitiesRepository } from '@/features/community/repository/community.repository';
import { createCommunitySchema } from '@/features/community/schemas';
import { verifySession } from '@/lib/auth/session';

export async function GET() {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json(await communitiesRepository.findAll());
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const input = createCommunitySchema.parse(await request.json());
  return NextResponse.json(await communitiesRepository.create(input), { status: 201 });
}
