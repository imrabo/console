import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import resourcesService from '../services/resourcesService';
import { toast } from 'sonner';
import type { ResourceFilters } from '../types/resources.types';
import type { CreateResourceFormValues, UpdateResourceFormValues } from '../schemas';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';

/**
 * Hook to fetch all resources with optional filters
 */
export const useResourcesQuery = (filters?: ResourceFilters) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, filters],
    queryFn: () =>
      resourcesService.fetchResources(
        filters ? ({ ...filters } as Record<string, string | number | boolean | Date>) : undefined
      ),
  });
};

/**
 * Legacy hook to fetch both resources and products for backward compatibility
 */
export const useResourcesAndProductsQuery = () => {
  return useQuery({
    queryKey: ['resources-and-products'],
    queryFn: async () => {
      const [files, products] = await Promise.all([
        resourcesService.fetchFileResources(),
        resourcesService.fetchProducts(),
      ]);
      return { files, products };
    },
  });
};

/**
 * Hook to fetch a single resource by ID
 */
export const useResourceQuery = (id: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, id],
    queryFn: () => resourcesService.fetchResourceById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch resources by creator
 */
export const useResourcesByCreatorQuery = (creatorId: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'by-creator', creatorId],
    queryFn: () => resourcesService.fetchResourcesByCreator(creatorId),
    enabled: !!creatorId,
  });
};

/**
 * Hook to fetch resource statistics
 */
export const useResourceStatsQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'stats'],
    queryFn: () => resourcesService.getResourceStats(),
  });
};

/**
 * Hook to fetch popular resources
 */
export const usePopularResourcesQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'popular', limit],
    queryFn: () => resourcesService.getPopularResources(limit),
  });
};

/**
 * Hook to fetch recent resources
 */
export const useRecentResourcesQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'recent', limit],
    queryFn: () => resourcesService.getRecentResources(limit),
  });
};

/**
 * Hook to create a new resource
 */
export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceFormValues) => resourcesService.createResource(data as any),

    onSuccess: (newResource) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'stats'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'recent'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success(`Resource "${newResource.title}" created successfully`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to create resource');
    },
  });
};

/**
 * Hook to create a new product for backward compatibility
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => resourcesService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources-and-products'] });
      toast.success('Catalog product added successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add product');
    },
  });
};

/**
 * Hook to update an existing resource
 */
export const useUpdateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceFormValues }) =>
      resourcesService.updateResource(id, data as any),

    onSuccess: (updatedResource) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, updatedResource.id] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'recent'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success(`Resource "${updatedResource.title}" updated successfully`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update resource');
    },
  });
};

/**
 * Hook to delete a resource
 */
export const useDeleteResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resourcesService.deleteResource(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, id] });
      queryClient.invalidateQueries({ queryKey: ['resources-and-products'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'stats'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'recent'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success('Resource deleted successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete resource');
    },
  });
};

/**
 * Hook to delete a product for backward compatibility
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resourcesService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources-and-products'] });
      toast.success('Product deleted from catalog');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete product');
    },
  });
};

/**
 * Hook to increment download count for a resource
 */
export const useIncrementDownloadsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resourcesService.incrementDownloads(id),

    onSuccess: (updatedResource) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, updatedResource.id] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'stats'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success(`Download count incremented for "${updatedResource.title}"`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to increment download count');
    },
  });
};
