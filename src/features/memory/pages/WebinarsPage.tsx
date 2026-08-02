import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useWebinarsQuery,
  useWebinarDetailsQuery,
  useCreateWebinarMutation,
  useUpdateWebinarMutation,
  useDeleteWebinarMutation,
} from "../hooks/useWebinars";
import { Webinar, WebinarStatus } from "../types";
import { DataTable } from "@/components/tables/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateWebinarForm } from "../components/CreateWebinarForm";
import {
  PlusCircle,
  Video,
  Calendar,
  Users,
  Copy,
  Check,
  Archive,
  Globe,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

import { webinarStatusEnum } from "../schemas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "radix-ui";

export const WebinarsPage: React.FC = () => {
  const { data, isLoading } = useWebinarsQuery();

  const createWebinarMutation = useCreateWebinarMutation();
  const updateWebinarMutation = useUpdateWebinarMutation();
  const deleteWebinarMutation = useDeleteWebinarMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateSubmit = (values: any) => {
    createWebinarMutation.mutate(values, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleEditSubmit = (values: any) => {
    if (!editingWebinar) return;
    updateWebinarMutation.mutate(
      { id: editingWebinar.id, data: values },
      {
        onSuccess: () => setEditingWebinar(null),
      },
    );
  };

  const handleStatusChange = (id: string, status: WebinarStatus) => {
    updateWebinarMutation.mutate({ id, data: { status } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this webinar?")) {
      deleteWebinarMutation.mutate(id);
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

  const columns: ColumnDef<Webinar>[] = [
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Webinar Info",
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
              onClick={() => setSelectedWebinar(w)}
              className="h-8 rounded-lg text-xs font-semibold"
            >
              Roster
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setEditingUser(w as any)} // Hooking to edit states
            >
              <Edit className="h-4 w-4 text-indigo-500" />
            </Button>
            {w.status !== WebinarStatus.Upcoming && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(w.id, WebinarStatus.Upcoming)}
                className="h-8 w-8 rounded-lg text-emerald-500 hover:bg-emerald-500/5"
                title="Publish Webinar"
              >
                <Globe className="h-4 w-4" />
              </Button>
            )}
            {w.status !== WebinarStatus.Cancelled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleStatusChange(w.id, WebinarStatus.Cancelled)
                }
                className="h-8 w-8 rounded-lg text-amber-500 hover:bg-amber-500/5"
                title="Archive Webinar"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(w.id)}
              className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/5"
              title="Delete Webinar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Helper hook mapper to support quick edit triggering
  const setEditingUser = (w: Webinar) => {
    setEditingWebinar(w);
  };

  console.log(`data: ${data?.toString()} `);

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Header Block */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Webinars</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Publish educational parent seminars, edit speaker bios, copy meeting
            links, and monitor registrant rosters.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        searchKey="title"
        searchPlaceholder="Search webinars by title..."
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
              Schedule Webinar Seminar
            </DialogTitle>
            <DialogDescription>
              Organize a new online presentation or parenting workbook review
              session.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[75vh]">
            <CreateWebinarForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setIsCreateOpen(false)}
              isSubmitting={createWebinarMutation.isPending}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingWebinar}
        onOpenChange={(open) => !open && setEditingWebinar(null)}
      >
        <DialogContent className="bg-card border-border rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Webinar details
            </DialogTitle>
            <DialogDescription>
              Modify parameters for: {editingWebinar?.title}.
            </DialogDescription>
          </DialogHeader>
          {editingWebinar && (
            <CreateWebinarForm
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingWebinar(null)}
              isSubmitting={updateWebinarMutation.isPending}
              defaultValues={{
                title: editingWebinar.title,
                description: editingWebinar.description,
                speakerName: editingWebinar.speakerName,
                speakerDesignation: editingWebinar.speakerDesignation,

                meetingUrl: editingWebinar.meetingUrl,
                thumbnailUrl: editingWebinar.thumbnailUrl,
                status: editingWebinar.status,
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Registrations Roster Dialog */}
      <Dialog
        open={!!selectedWebinar}
        onOpenChange={(open) => !open && setSelectedWebinar(null)}
      >
        <DialogContent className="bg-card border-border max-w-md rounded-2xl shadow-2xl">
          {selectedWebinar && (
            <WebinarRosterList
              webinar={selectedWebinar}
              onClose={() => setSelectedWebinar(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-component to load and render webinar roster
const WebinarRosterList: React.FC<{
  webinar: Webinar;
  onClose: () => void;
}> = ({ webinar, onClose }) => {
  const { data: roster = [], isLoading } = useWebinarDetailsQuery(webinar.id);

  return (
    <div className="space-y-4 pt-2">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">
          Webinar Attendee Roster
        </DialogTitle>
        <DialogDescription>
          Registered parents for:{" "}
          <span className="text-foreground font-semibold">{webinar.title}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="border-border/40 bg-muted/20 max-h-[300px] scrollbar-thin overflow-y-auto rounded-xl border p-4">
        {isLoading ? (
          <div className="text-muted-foreground py-4 text-center text-xs">
            Loading registrants...
          </div>
        ) : roster.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-xs font-medium italic">
            No registrants found for this webinar.
          </div>
        ) : (
          <div className="divide-border/40 divide-y">
            {roster.map((reg) => (
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
      </div>

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

export default WebinarsPage;
