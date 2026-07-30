import { NextResponse } from 'next/server';

import { communitiesRepository } from '@/features/community/repository/community.repository';
import { updateCommunitySchema } from '@/features/community/schemas';
import { verifySession } from '@/lib/auth/session';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const community = await communitiesRepository.findById((await params).id);
  return community
    ? NextResponse.json(community)
    : NextResponse.json({ error: 'Community not found' }, { status: 404 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!(await communitiesRepository.findById(id))) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  return NextResponse.json(
    await communitiesRepository.update(id, updateCommunitySchema.parse(await request.json()))
  );
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!(await communitiesRepository.findById(id))) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  await communitiesRepository.delete(id);
  return new NextResponse(null, { status: 204 });
}
