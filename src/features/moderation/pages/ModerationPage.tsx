'use client';

import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { MoreHorizontal, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/tables/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useModerationCasesQuery } from '../hooks/useModeration';
import { ModerationType } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ModerationForm from '../components/ModerationForm';

export const ModerationPage: React.FC = () => {
  const router = useRouter();

  const { data: moderationCases, isLoading } = useModerationCasesQuery();

  const columns: ColumnDef<ModerationType>[] = [
    {
      id: 'serialNo',
      header: 'Sr. No.',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'entityType',
      header: 'Entity',
      cell: ({ row }) => (
        <span className="font-medium capitalize">
          {row.original.entityType.replaceAll('_', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => <p className="max-w-xs truncate">{row.original.reason}</p>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;

        let color = 'bg-slate-500/10 text-slate-500';

        if (status === 'pending') color = 'bg-yellow-500/10 text-yellow-600';

        if (status === 'reviewing') color = 'bg-blue-500/10 text-blue-600';

        if (status === 'resolved') color = 'bg-green-500/10 text-green-600';

        if (status === 'rejected') color = 'bg-red-500/10 text-red-600';

        return (
          <span className={`rounded px-2 py-1 text-xs font-semibold capitalize ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.action.replaceAll('_', ' ')}</span>
      ),
    },
    {
      accessorKey: 'assignedModeratorId',
      header: 'Moderator',
      cell: ({ row }) => row.original.assignedModeratorId ?? '--',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const moderation = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/moderation/${moderation.id}`}>View Details</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={`/moderation/${moderation.id}/edit`}>Edit Case</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ModerationType | null>(null);

  const handleCreate = () => {
    setSelectedCase(null);

    setOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Moderation Cases</h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Review reported content and manage moderation actions.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={moderationCases ?? []}
        loading={isLoading}
        searchKey="reason"
        searchPlaceholder="Search moderation cases..."
        onRowClick={(item) => router.push(`/moderation/${item.id}`)}
        toolbar={
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Case
          </Button>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCase ? 'Edit Moderation Case' : 'Create Moderation Case'}
            </DialogTitle>
            <DialogDescription>
              Review and manage moderation actions and assigned details.
            </DialogDescription>
          </DialogHeader>

          <ModerationForm
            initialData={selectedCase}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationPage;
