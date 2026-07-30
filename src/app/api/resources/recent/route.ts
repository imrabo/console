import { NextRequest, NextResponse } from 'next/server';
import { resourcesRepository } from '@/features/resources/repository/resources.repository';

// GET /api/resources/recent?limit=10 - Get most recently created resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    return NextResponse.json(await resourcesRepository.getRecent(limit));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recent resources' },
      { status: 500 }
    );
  }
}
