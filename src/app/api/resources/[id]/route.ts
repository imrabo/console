import { NextRequest, NextResponse } from 'next/server';
import { resourcesRepository } from '@/features/resources/repository/resources.repository';
import { updateResourceSchema } from '@/features/resources/schemas';

// GET /api/resources/:id - Get a single resource by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const resource = await resourcesRepository.findById(id);

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// PATCH /api/resources/:id - Update a resource
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existingResource = await resourcesRepository.findById(id);

    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    const result = await resourcesRepository.update(id, updateResourceSchema.parse(await request.json()));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/:id - Delete a resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if resource exists first
    const existingResource = await resourcesRepository.findById(id);

    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    await resourcesRepository.delete(id);

    return NextResponse.json(
      { ok: true, message: 'Resource deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
