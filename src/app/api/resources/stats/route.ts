import { NextResponse } from 'next/server';
import { resourcesRepository } from '@/features/resources/repository/resources.repository';

// GET /api/resources/stats - Get resource statistics
export async function GET() {
  try {
    return NextResponse.json(await resourcesRepository.getStats());
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resource statistics' },
      { status: 500 }
    );
  }
}
