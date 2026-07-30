import { NextResponse } from 'next/server';

import { adminDb } from '@/lib/firebase/admin';
import { verifySession } from '@/lib/auth/session';
import { createFeedPostSchema, FeedPostQueryParams } from '@/features/feed/schemas/posts.schema';

export async function GET(request: Request) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const params: Partial<FeedPostQueryParams> = {

    visibility: searchParams.get('visibility') as any,
    mediaType: searchParams.get('mediaType') as any,
    isAnonymous:
      searchParams.get('isAnonymous') !== null
        ? searchParams.get('isAnonymous') === 'true'
        : undefined,
    userId: searchParams.get('userId') || undefined,
    groupId: searchParams.get('groupId') || undefined,
    limit: parseInt(searchParams.get('limit') || '10'),
    page: parseInt(searchParams.get('page') || '1'),
  };

  let query: FirebaseFirestore.Query = adminDb.collection('feed_posts');

  // Firestore filters (enable as needed)


  if (params.visibility) {
    query = query.where("visibility", "==", params.visibility);
  }

  if (params.mediaType) {
    query = query.where("mediaType", "==", params.mediaType);
  }

  if (params.isAnonymous !== undefined) {
    query = query.where("isAnonymous", "==", params.isAnonymous);
  }

  if (params.userId) {
    query = query.where("userId", "==", params.userId);
  }

  if (params.groupId) {
    query = query.where("groupId", "==", params.groupId);
  }

  const snapshot = await query.get();

  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const start = (params.page! - 1) * params.limit!;
  const end = start + params.limit!;

  const paginatedPosts = posts.slice(start, end);

  return NextResponse.json({
    data: paginatedPosts,
    total: posts.length,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(posts.length / params.limit!),
  });
}

export async function POST(request: Request) {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();

  const validation = createFeedPostSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: validation.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  const now = new Date().toISOString();

  const feedPost = {
    ...payload,

    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    saveCount: 0,
    viewCount: 0,
    reportCount: 0,

    mediaUrls: payload.mediaUrls ?? [],

    thumbnailUrl: payload.thumbnailUrl ?? null,
    groupId: payload.groupId ?? null,

    createdAt: now,
    updatedAt: now,
    deletedAt: null,

    createdBy: session,
    updatedBy: session,
  };

  const ref = await adminDb.collection('feed_posts').add(feedPost);

  const created = await ref.get();

  return NextResponse.json(
    {
      id: created.id,
      ...created.data(),
    },
    {
      status: 201,
    }
  );
}
