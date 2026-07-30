import { NextRequest, NextResponse } from 'next/server';
import { resourcesRepository } from '@/features/resources/repository/resources.repository';

// POST /api/resources/:id/downloads - Increment download count for a resource
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const updatedResource = await resourcesRepository.incrementDownloads(id);

    return NextResponse.json(updatedResource);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to increment download count' },
      { status: 500 }
    );
  }
}
