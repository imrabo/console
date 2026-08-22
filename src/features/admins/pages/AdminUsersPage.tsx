"use client";

import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PlusCircle, MoreHorizontal } from "lucide-react";

import {
  useAdminUsersQuery,
  useDeleteAdminUserMutation,
} from "../hooks/useAdmins";
import { Spinner } from "@/components/ui/spinner";
import type { IAdminUser } from "../types";
import AdminUserDialog from "../components/AdminUserDialog";

export const AdminUsersPage: React.FC = () => {
  const { data, isLoading } = useAdminUsersQuery();
  const deleteAdminUser = useDeleteAdminUserMutation();
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IAdminUser | null>(null);
  const handleDelete = (admin: IAdminUser) => {
    if (window.confirm(`Delete ${admin.fullName}?`))
      deleteAdminUser.mutate(admin.id);
  };

  const handleCreate = () => {
    setSelectedAdmin(null);
    setOpen(true);
  };

  const handleEdit = (admin: IAdminUser) => {
    setSelectedAdmin(admin);
    setOpen(true);
  };

  const columns: ColumnDef<IAdminUser>[] = [
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "fullName",
      header: "Administrator",
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <div className="space-y-0.5">
            <p className="text-foreground font-semibold">{admin.fullName}</p>
            <p className="text-muted-foreground text-xs">{admin.email}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const admin = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleEdit(admin)}>
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(admin)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Title block */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Users Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Browse registered workspaces, monitor system roles, and execute
            safety controls.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <DataTable
        columns={columns}
        data={data ?? []}
        searchKey="fullName"
        searchPlaceholder="Search users by name..."
        loading={isLoading}
        onRowClick={(selectedAdmin) => (
          <AdminUserDialog
            open={open}
            onOpenChange={setOpen}
            admin={selectedAdmin}
          />
        )}
        toolbar={
          <Button onClick={handleCreate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        }
      />
      <AdminUserDialog
        open={open}
        onOpenChange={setOpen}
        admin={selectedAdmin}
      />
    </div>
  );
};

export default AdminUsersPage;
