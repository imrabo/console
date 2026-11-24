'use client';

import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { useAdminUsersQuery, useDeleteAdminUserMutation } from '../hooks/useAdmins';
import { Spinner } from '@/components/ui/spinner';
import { IAdminUser } from '../types';
import AdminUserDialog from '../components/AdminUserDialog';

import PageWrapper from '@/components/wrappers/PageWrapper';
import { formatDate } from '@/utils/date';

export const AdminUsersPage: React.FC = () => {
  const { data, isLoading, isError, refetch, isFetching } = useAdminUsersQuery();
  const { mutate: deleteAdminUser, isPending: isDeletingAdmin } = useDeleteAdminUserMutation();
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IAdminUser | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<IAdminUser | null>(null);

  const handleDelete = (admin: IAdminUser) => {
    setAdminToDelete(admin);
  };

  const handleConfirmDelete = () => {
    if (!adminToDelete) {
      return;
    }

    deleteAdminUser(adminToDelete.id, {
      onSuccess: () => {
        setAdminToDelete(null);
      },
    });
  };

  const handleCreate = () => {
    setSelectedAdmin(null);
    setOpen(true);
  };

  const handleEdit = (admin: IAdminUser) => {
    setSelectedAdmin(admin);
    setOpen(true);
  };

  // columns for iadminUser  
  const columns: ColumnDef<IAdminUser>[] = [
    {
      id: 'serialNo',
      header: 'Sr. No.',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'fullName',
      header: 'Administrator',
      cell: ({ row }) => {
        const admin = row.original;

        return <p className="text-foreground font-semibold">{admin.fullName}</p>;
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const admin = row.original;

        return <p className="text-foreground font-semibold">{admin.email}</p>;
      },
    },

    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.createdAt ?? Date.now())}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleEdit(admin)}>Edit</DropdownMenuItem>

              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(admin)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center gap-4 p-6">
          <p>Failed to load administrators.</p>
          <Button onClick={() => void refetch()} disabled={isFetching}>
            {isFetching ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="animate-fade-in space-y-6 p-6">
        {/* Main Table Card */}
        <DataTable
          columns={columns}
          data={data ?? []}
          searchKey="fullName"
          searchPlaceholder="Search users by name..."
          loading={isLoading}
          toolbar={
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          }
        />
        <AdminUserDialog open={open} onOpenChange={setOpen} admin={selectedAdmin} />
      </div>

      <ConfirmDialog
        open={Boolean(adminToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setAdminToDelete(null);
          }
        }}
        title="Delete admin?"
        description={
          adminToDelete ? (
            <>
              Are you sure you want to delete{' '}
              <span className="text-foreground font-medium">{adminToDelete.fullName}</span>?
              <span className="mt-1 block">This action cannot be undone.</span>
            </>
          ) : null
        }
        confirmText="Delete Admin"
        onConfirm={handleConfirmDelete}
        loading={isDeletingAdmin}
        destructive
      />
    </PageWrapper>
  );
};

export default AdminUsersPage;
