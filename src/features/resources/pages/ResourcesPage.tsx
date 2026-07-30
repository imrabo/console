'use client';

import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useResourcesQuery, useDeleteResourceMutation } from '../hooks/useResources';
import type { Resource } from '../types/resources.types';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, PlusCircle, Eye, Download, Crown } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { data: resources = [], isLoading } = useResourcesQuery();
  const { mutate: deleteResource, isPending: isDeleting } = useDeleteResourceMutation();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const columns: ColumnDef<Resource>[] = [
    {
      id: 'serialNo',
      header: 'Sr. No.',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const resource = row.original;
        return (
          <div className="flex items-center gap-3">
            {resource.thumbnail && (
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="h-10 w-10 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="text-foreground font-bold">{resource.title}</p>
              <p className="text-muted-foreground max-w-[200px] truncate text-xs">
                {resource.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-semibold">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'fileType',
      header: 'Type',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
          {row.getValue('fileType')}
        </span>
      ),
    },
    {
      accessorKey: 'downloads',
      header: 'Downloads',
      cell: ({ row }) => (
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          📥 {row.getValue('downloads')}
        </span>
      ),
    },
    {
      accessorKey: 'isPremium',
      header: 'Premium',
      cell: ({ row }) =>
        row.getValue('isPremium') ? (
          <Crown className="h-4 w-4 text-amber-500" />
        ) : (
          <span className="text-muted-foreground text-xs">Free</span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string | Date;
        return (
          <span className="text-muted-foreground text-xs">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const resource = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border-border/20 h-8 w-8 rounded-lg border"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border w-48 border">
              <DropdownMenuItem
                className="cursor-pointer rounded-md text-xs font-medium"
                onClick={() => router.push(`/resources/${resource.id}`)}
              >
                <Eye className="mr-2 h-3 w-3" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-md text-xs font-medium"
                onClick={() => router.push(`/resources/${resource.id}/edit`)}
              >
                Edit Resource
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer rounded-md text-xs font-medium"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
                    deleteResource(resource.id);
                  }
                }}
              >
                Delete Resource
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Title block */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Resources Management</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Manage digital resources, PDFs, templates, and educational materials.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <DataTable
        columns={columns}
        data={resources}
        searchKey="title"
        searchPlaceholder="Search resources by title..."
        loading={isLoading}
        onRowClick={(resource) => router.push(`/resources/${resource.id}`)}
        toolbar={
          <Link href="/resources/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Resource
            </Button>
          </Link>
        } // Using the button in the header instead
      />
    </div>
  );
};

export default ResourcesPage;
