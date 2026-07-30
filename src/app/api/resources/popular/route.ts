import { NextRequest, NextResponse } from 'next/server';
import { resourcesRepository } from '@/features/resources/repository/resources.repository';

// GET /api/resources/popular?limit=10 - Get most popular (downloaded) resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    return NextResponse.json(await resourcesRepository.getPopular(limit));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch popular resources' },
      { status: 500 }
    );
  }
}
