import React, { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useMemorysQuery,
  useCreateMemoryMutation,
  useUpdateMemoryMutation,
  useDeleteMemoryMutation,
} from "../hooks/useMemory";
import { type Memory, MemoryStatus } from "../types";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateMemoryForm } from "../components/CreateMemoryForm";
import {
  PlusCircle,
  Copy,
  Check,
  Archive,
  Globe,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

import { ScrollArea } from "@/components/ui/scroll-area";

export const MemorysPage: React.FC = () => {
  const { data, isLoading } = useMemorysQuery();

  const createMemoryMutation = useCreateMemoryMutation();
  const updateMemoryMutation = useUpdateMemoryMutation();
  const deleteMemoryMutation = useDeleteMemoryMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateSubmit = (values: any) => {
    createMemoryMutation.mutate(values, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleEditSubmit = (values: any) => {
    if (!editingMemory) return;
    updateMemoryMutation.mutate(
      { id: editingMemory.id, data: values },
      {
        onSuccess: () => setEditingMemory(null),
      },
    );
  };

  const handleStatusChange = (id: string, status: MemoryStatus) => {
    updateMemoryMutation.mutate({ id, data: { status } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this memory?")) {
      deleteMemoryMutation.mutate(id);
    }
  };

  const handleCopyLink = (id: string, url: string) => {
    // Check if window is available (browser environment)
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Zoom meeting link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const columns: ColumnDef<Memory>[] = [
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Memory Info",
      cell: ({ row }) => {
        const w = row.original;
        return (
          <div className="flex items-center gap-3">
            {/* {w.thumbnailUrl && (
              <image
                src={w.thumbnailUrl}
                alt={w.title}
                height={10}
                width={16}
                className="h-10 w-16 object-cover rounded-lg border border-border/50 hidden sm:block"
              />
            )} */}
            <div>
              <p className="text-foreground font-bold">{w.title}</p>
              <p className="text-muted-foreground line-clamp-1 text-xs">
                {w.description}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "speakerName",
      header: "Speaker / Host",
      cell: ({ row }) => {
        const w = row.original;
        return (
          <div>
            <p className="text-foreground text-xs font-bold">{w.speakerName}</p>
            <p className="text-muted-foreground text-[10px] leading-none">
              {w.speakerDesignation}
            </p>
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'date',
    //   header: 'Scheduled Date',
    //   cell: ({ row }) => {
    //     const w = row.original;
    //     return (
    //       <div className="text-xs font-semibold text-muted-foreground">
    //         <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-indigo-500" /> {w.scheduledAt}</p>
    //         <p className="mt-0.5">{w.scheduledAt} ({w} mins)</p>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "registrationsCount",
      header: "Registrants",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-bold">
          👤 {row.getValue("registrationsCount")} registered
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let color = "bg-slate-500/10 text-slate-500";
        if (status === "Published")
          color = "bg-emerald-500/10 text-emerald-500";
        else if (status === "Archived")
          color = "bg-amber-500/10 text-amber-500";
        return (
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${color}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const w = row.original;
        const isCopied = copiedId === w.id;

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => handleCopyLink(w.id, w.meetingUrl ?? "")}
              title="Copy Zoom Link"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMemory(w)}
              className="h-8 rounded-lg text-xs font-semibold"
            >
              Roster
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setEditingMemory(w)} // Hooking to edit states
            >
              <Edit className="h-4 w-4 text-indigo-500" />
            </Button>
            {w.status !== MemoryStatus.Upcoming && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(w.id, MemoryStatus.Upcoming)}
                className="h-8 w-8 rounded-lg text-emerald-500 hover:bg-emerald-500/5"
                title="Publish Memory"
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
            {w.status !== MemoryStatus.Cancelled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(w.id, MemoryStatus.Cancelled)}
                className="h-8 w-8 rounded-lg text-amber-500 hover:bg-amber-500/5"
                title="Archive Memory"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(w.id)}
              className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/5"
              title="Delete Memory"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Helper hook mapper to support quick edit triggering

  console.log(`data: ${data?.toString()} `);

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Header Block */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Memorys</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Publish educational parent seminars, edit speaker bios, copy meeting
            links, and monitor registrant rosters.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <DataTable
        columns={columns}
        data={data?.data?.data ?? []}
        searchKey="title"
        searchPlaceholder="Search memorys by title..."
        loading={isLoading}
        toolbar={
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="h-4 w-4" /> Schedule Seminar
          </Button>
        }
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border !max-w-3xl rounded-2xl p-0 shadow-2xl">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-bold">
              Schedule Memory Seminar
            </DialogTitle>
            <DialogDescription>
              Organize a new online presentation or parenting workbook review
              session.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[75vh]">
            <CreateMemoryForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createMemoryMutation.isPending}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMemory}
        onOpenChange={(open) => !open && setEditingMemory(null)}
      >
        <DialogContent className="bg-card border-border rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Memory details
            </DialogTitle>
            <DialogDescription>
              Modify parameters for: {editingMemory?.title}.
            </DialogDescription>
          </DialogHeader>
          {editingMemory && (
            <CreateMemoryForm
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingMemory(null)}
              isSubmitting={updateMemoryMutation.isPending}
              defaultValues={{
                title: editingMemory.title,
                description: editingMemory.description,
                speakerName: editingMemory.speakerName,
                speakerDesignation: editingMemory.speakerDesignation,

                meetingUrl: editingMemory.meetingUrl,
                thumbnailUrl: editingMemory.thumbnailUrl,
                status: editingMemory.status,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Registrations Roster Dialog */}
      <Dialog
        open={!!selectedMemory}
        onOpenChange={(open) => !open && setSelectedMemory(null)}
      >
        <DialogContent className="bg-card border-border max-w-md rounded-2xl shadow-2xl">
          {selectedMemory && (
            <MemoryRosterList
              memory={selectedMemory}
              onClose={() => setSelectedMemory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-component to load and render memory roster
const MemoryRosterList: React.FC<{
  memory: Memory;
  onClose: () => void;
}> = ({ memory, onClose }) => {
  // const { data: roster = [], isLoading } = useMemoryQuery(memory.id);
  // Assuming the roster is part of the memory details returned by useMemoryQuery
  // Adjust the data extraction as needed based on the actual API response structure
  // For example, if the API returns { memory: { ... , roster: [...] } }, then:
  // const { data: memoryData, isLoading } = useMemoryQuery(memory.id);
  // const roster = memoryData?.roster ?? [];

  return (
    <div className="space-y-4 pt-2">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">
          Memory Attendee Roster
        </DialogTitle>
        <DialogDescription>
          Registered parents for:{" "}
          <span className="text-foreground font-semibold">{memory.title}</span>
        </DialogDescription>
      </DialogHeader>

      {/* <div className="border-border/40 bg-muted/20 max-h-[300px] scrollbar-thin overflow-y-auto rounded-xl border p-4">
        {isLoading ? (
          <div className="text-muted-foreground py-4 text-center text-xs">
            Loading registrants...
          </div>
        ) : roster.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-xs font-medium italic">
            No registrants found for this memory.
          </div>
        ) : (
          <div className="divide-border/40 divide-y">
            {roster.map((reg: any) => (
              <div
                key={reg.id}
                className="flex items-center justify-between py-2.5 text-xs font-semibold"
              >
                <span>{reg.userId}</span>
                <span className="text-muted-foreground text-[10px]">
                  Registered {new Date(reg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <div className="border-border/50 flex justify-end border-t pt-4">
        <Button
          onClick={onClose}
          className="h-10 rounded-xl bg-indigo-600 font-medium text-white hover:bg-indigo-700"
        >
          Close List
        </Button>
      </div>
    </div>
  );
};

export default MemorysPage;
