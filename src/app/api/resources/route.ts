import { NextRequest, NextResponse } from 'next/server';
import { resourcesRepository } from '@/features/resources/repository/resources.repository';
import { createResourceSchema } from '@/features/resources/schemas';
import type { Resource, ResourceFilters } from '@/features/resources/types';

// GET /api/resources - Get all resources with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse filters from query params
    const filters: ResourceFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      fileType: searchParams.get('fileType') || undefined,
      isPremium: searchParams.get('isPremium')
        ? searchParams.get('isPremium') === 'true'
        : undefined,
      creatorId: searchParams.get('creatorId') || undefined,
    };

    let resources = await resourcesRepository.findAll();

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      resources = resources.filter(
        (resource: Resource) =>
          resource.title.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category) {
      resources = resources.filter((resource: Resource) => resource.category === filters.category);
    }

    if (filters.fileType) {
      resources = resources.filter((resource: Resource) => resource.fileType === filters.fileType);
    }

    if (filters.isPremium !== undefined) {
      resources = resources.filter(
        (resource: Resource) => resource.isPremium === filters.isPremium
      );
    }

    if (filters.creatorId) {
      resources = resources.filter(
        (resource: Resource) => resource.creatorId === filters.creatorId
      );
    }

    return NextResponse.json(resources);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const input = createResourceSchema.parse(await request.json());
    const createdResource = await resourcesRepository.create(input);

    return NextResponse.json(createdResource, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create resource' },
      { status: 500 }
    );
  }
}
