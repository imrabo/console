import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useUsersQuery } from "../hooks/useUsers";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import type { UserType } from "../types";

export const UsersPage: React.FC = () => {
  const { data: users, isLoading } = useUsersQuery();
  const router = useNavigate();

  const columns: ColumnDef<UserType>[] = [
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "fullName",
      header: "User",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-3">
            <div>
              <p className="text-foreground font-bold">{u.fullName}</p>
              <p className="text-muted-foreground text-xs">{u.email}</p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let color = "secondary";
        if (status === "active") color = "bg-emerald-500/10 text-emerald-500";
        else if (status === "suspended")
          color = "bg-amber-500/10 text-amber-500";
        return (
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${color}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "membershipType",
      header: "Membership",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-semibold">
          {row.getValue("membershipType") === "premium" ? "👑 Premium" : "Free"}
        </span>
      ),
    },
    {
      accessorKey: "coinBalance",
      header: "Coins",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          🪙 {row.getValue("coinBalance")}
        </span>
      ),
    },
    {
      accessorKey: "isExpert",
      header: "Expert",
      cell: ({ row }) =>
        row.getValue("isExpert") ? (
          <Shield className="h-4 w-4 text-amber-500" />
        ) : (
          <Shield className="h-4 w-4 text-red-500" />
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="border-border/20 h-8 w-8 rounded-lg border"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card border-border w-48 border"
            >
              <DropdownMenuItem className="cursor-pointer rounded-md text-xs font-medium">
                <Link to={`/users/${u.id}`}>View Account Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md text-xs font-medium">
                <Link to={`/users/${u.id}/edit`}>Edit User details</Link>
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
        data={users?.data ?? []}
        searchKey="fullName"
        searchPlaceholder="Search users by name..."
        loading={isLoading}
        onRowClick={(user) => router(`/users/${user.id}`)}
        toolbar={
          <Link to="/users/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add User
            </Button>
          </Link>
        }
      />
    </div>
  );
};

export default UsersPage;
