import React, { useState } from "react";

import {
  useOrganizationsQuery,
  useCreateCommunityMutation,
  useDeleteCommunityMutation,
} from "../hooks/useCommunity";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  ICommunityAccessType,
  ICommunityStatus,
  ICommunityType,
  ICommunityVisibility,
  type ICommunity,
} from "../types";

import { Link, useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  MessageCircle,
  Users,
  BarChart3,
  Trash2,
  PlusCircle,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";

export const OrganizationsPage: React.FC = () => {
  const { data, isLoading } = useOrganizationsQuery();
  const createGroupMutation = useCreateCommunityMutation();
  const deleteGroupMutation = useDeleteCommunityMutation();

  const [isGroupOpen, setIsGroupOpen] = useState(false);

  const router = useNavigate();

  // Group Form state
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupCat] = useState("Neighborhood");

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;
    createGroupMutation.mutate(
      {
        name: groupName,
        description: groupDesc,
        category: groupCat,
        memberCount: 1,
        adminId: "usr-001", // Assigned to Super Admin for mock
        userIds: ["usr-001"],
        type: ICommunityType.Family,
        accessType: ICommunityAccessType.Free,
        visibility: ICommunityVisibility.Public,
        status: ICommunityStatus.Active,
      },
      {
        onSuccess: () => {
          setIsGroupOpen(false);
          setGroupName("");
          setGroupDesc("");
        },
      },
    );
  };

  // Columns Definitions
  const columns: ColumnDef<ICommunity>[] = [
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },

    {
      accessorKey: "name",
      header: "Community",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-foreground font-semibold">{row.original.name}</p>

          {row.original.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },

    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;

        return (
          <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-600 capitalize">
            {type ? type.replace(/_/g, " ") : "N/A"}
          </span>
        );
      },
    },

    {
      accessorKey: "accessType",
      header: "Access",
      cell: ({ row }) => {
        const accessType = row.original.accessType;

        return (
          <span className="rounded-md bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-600 capitalize">
            {accessType ? accessType.replace(/_/g, " ") : "N/A"}
          </span>
        );
      },
    },

    {
      accessorKey: "visibility",
      header: "Visibility",
      cell: ({ row }) => (
        <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 capitalize">
          {row.original.visibility ?? ICommunityVisibility.Public.toString()}
        </span>
      ),
    },

    {
      accessorKey: "memberCount",
      header: "Members",
      cell: ({ row }) => {
        const memberCount = row.original.memberCount;

        return (
          <span className="text-sm font-medium">{memberCount ?? "0"}</span>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const colors = {
          active: "bg-green-500/10 text-green-600",
          archived: "bg-yellow-500/10 text-yellow-600",
          deleted: "bg-red-500/10 text-red-600",
        };

        return (
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${colors[status]}`}
          >
            {status ?? ICommunityStatus.Archived.toString()}
          </span>
        );
      },
    },

    // {
    //   accessorKey: 'createdAt',
    //   header: 'Created',
    //   cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    // },

    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const community = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem>
                <Link to={`/admin/workspaces/${community.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to={`/admin/workspaces/${community.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Community
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link to={`/admin/workspaces/${community.id}/members`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Members
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to={`/admin/workspaces/${community.id}/messages`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Community Chats
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to={`/admin/workspaces/${community.id}/analytics`}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  if (confirm(`Delete "${community.name}"?`)) {
                    deleteGroupMutation.mutate(community.id);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Community
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  console.log("OrganizationsPage data:", data);
  console.log(data);
  console.log(columns);
  console.log(data?.data?.length);

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Page Title */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Community Network
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Oversee community neighborhood hubs, verify workspaces data, and
            moderate group announcements.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey={"name"}
        enableRefresh={true}
        searchPlaceholder="Filter community groups by name..."
        loading={isLoading}
        // emptyMessage="Hello"
        // filters={[{ id: 'type', value: 'Type' }]}
        // enableColumnVisibility={true}
        // enableExportCSV
        // enableExportExcel
        // enableFiltering
        // enablePagination
        // enableRowSelection
        // enableSearch
        // enableSorting

        onRowClick={(cmty) => router(`/workspaces/${cmty.id}`)}
        toolbar={
          <Button
            onClick={() => setIsGroupOpen(true)}
            // className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 font-medium text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4" /> Create Community Group
          </Button>
        }
      />

      {/* Create Community Group Dialog */}
      <Dialog open={isGroupOpen} onOpenChange={setIsGroupOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Create Community Group
            </DialogTitle>
            <DialogDescription>
              Add a new local geographic community group for parents.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGroupSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label
                htmlFor="gName"
                className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
              >
                Group Name
              </Label>
              <Input
                id="gName"
                placeholder="Portland South Playgroup"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="gDesc"
                className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
              >
                Description
              </Label>
              <Input
                id="gDesc"
                placeholder="Neighborhood playdates on Sunday afternoons..."
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
              />
            </div>
            {/* <div className="space-y-1">
              <Label
                htmlFor="gCat"
                className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
              >
                Category
              </Label>
              <Select value={groupCat} onValueChange={setGroupCat}>
                <SelectTrigger id="gCat" className="w-full">
                  <SelectValue placeholder="Select group category" />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectItem value="Neighborhood">Neighborhood</SelectItem>

                  <SelectItem value="Playgroup">Playgroup</SelectItem>

                  <SelectItem value="Homeschooling">Homeschooling</SelectItem>

                  <SelectItem value="Support Group">Support Group</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div className="border-border/50 flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGroupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create Group
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsPage;
