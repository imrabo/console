import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ColumnDef } from '@tanstack/react-table';
import {
  useMeetupsQuery,
  useMeetupDetailsQuery,
  useCreateMeetupMutation,
  useUpdateMeetupMutation,
  useDeleteMeetupMutation,
} from '../hooks/useMeetups';
import { Meetup } from '../types';
import { DataTable } from '@/components/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateMeetupForm } from '../components/CreateMeetupForm';

const LeafletMap = dynamic(
  () => import('@/components/maps/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false }
);
import { PlusCircle, MapPin, Calendar, Users, ListFilter, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const MeetupsPage: React.FC = () => {
  const { data, isLoading } = useMeetupsQuery();
  const meetups = data?.meetups || [];
  const categories = data?.categories || [];

  const createMeetupMutation = useCreateMeetupMutation();
  const updateMeetupMutation = useUpdateMeetupMutation();
  const deleteMeetupMutation = useDeleteMeetupMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);

  const handleCreateSubmit = (values: any) => {
    // Merge organizerId
    createMeetupMutation.mutate(
      {
        ...values,
        organizerId: 'usr-001', // Default mock organizer id
      },
      {
        onSuccess: () => setIsCreateOpen(false),
      }
    );
  };

  const handleCancelMeetup = (id: string) => {
    if (confirm('Are you sure you want to cancel this meetup?')) {
      updateMeetupMutation.mutate({
        id,
        data: { status: 'Cancelled' },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this meetup permanently?')) {
      deleteMeetupMutation.mutate(id);
    }
  };

  const columns: ColumnDef<Meetup>[] = [
    {
      id: 'serialNo',
      header: 'Sr. No.',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'title',
      header: 'Event Info',
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div>
            <p className="text-foreground font-bold">{m.title}</p>
            <p className="text-muted-foreground line-clamp-1 text-xs">{m.description}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 uppercase">
          {row.getValue('category')}
        </span>
      ),
    },
    {
      accessorKey: 'organizerName',
      header: 'Organizer',
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.getValue('organizerName')}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Schedule',
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="text-muted-foreground text-xs font-semibold">
            <p className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" /> {m.date}
            </p>
            <p className="mt-0.5">{m.time}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'registrationsCount',
      header: 'Registrations',
      cell: ({ row }) => {
        const m = row.original;
        const pct = Math.round((m.registrationsCount / m.maxRegistrations) * 100);
        return (
          <div className="text-xs font-semibold">
            <p className="text-foreground">
              {m.registrationsCount} / {m.maxRegistrations} slots
            </p>
            <div className="bg-muted mt-1 h-1.5 w-24 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-indigo-600"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const color =
          status === 'Active'
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-rose-500/10 text-rose-500';
        return (
          <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMeetup(m)}
              className="h-8 rounded-lg px-2 text-xs font-semibold"
            >
              View Roster
            </Button>
            {m.status === 'Active' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancelMeetup(m.id)}
                className="h-8 rounded-lg px-2 text-xs font-semibold text-amber-500 hover:bg-amber-500/5 hover:text-amber-600"
              >
                Cancel
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/5 hover:text-rose-600"
              onClick={() => handleDelete(m.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Header Block */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Meetups & Playdates</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Organize local weekend playgroups, review registrations, track attendance and coordinate
            coordinates.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 font-medium text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" /> Schedule Meetup Event
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={meetups}
        searchKey="title"
        searchPlaceholder="Search meetups by title..."
        loading={isLoading}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border max-w-xl rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Schedule Meetup Event</DialogTitle>
            <DialogDescription>
              Coordinate a local event for HUGGED parent members.
            </DialogDescription>
          </DialogHeader>
          <CreateMeetupForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateOpen(false)}
            categories={categories}
            isSubmitting={createMeetupMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Details Roster Drawer */}
      <Dialog open={!!selectedMeetup} onOpenChange={(open) => !open && setSelectedMeetup(null)}>
        <DialogContent className="bg-card border-border max-w-2xl rounded-2xl shadow-2xl">
          {selectedMeetup && (
            <MeetupDetailsRoster meetup={selectedMeetup} onClose={() => setSelectedMeetup(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-component to fetch and render RSVPs / Waitlists + Map preview
const MeetupDetailsRoster: React.FC<{
  meetup: Meetup;
  onClose: () => void;
}> = ({ meetup, onClose }) => {
  const { data: roster, isLoading } = useMeetupDetailsQuery(meetup.id);

  return (
    <div className="space-y-6 pt-4">
      <DialogHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 uppercase">
              {meetup.category}
            </span>
            <DialogTitle className="mt-1.5 text-xl font-bold">{meetup.title}</DialogTitle>
            <DialogDescription className="mt-1">
              Organized by{' '}
              <span className="text-foreground font-semibold">{meetup.organizerName}</span> on{' '}
              {meetup.date} at {meetup.time}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="border-border/40 grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
        {/* Left: Map Preview & details */}
        <div className="space-y-4">
          <div className="border-border bg-muted/20 h-[180px] overflow-hidden rounded-xl border">
            <LeafletMap
              lat={meetup.latitude}
              lng={meetup.longitude}
              interactive={false}
              popupText={meetup.locationName}
            />
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
              <MapPin className="h-3.5 w-3.5 text-indigo-600" /> Event Location
            </span>
            <p className="text-foreground text-xs font-semibold">{meetup.locationName}</p>
          </div>
          <div className="text-muted-foreground space-y-1 text-xs leading-relaxed">
            <span className="block text-[10px] font-bold tracking-wider uppercase">
              Description
            </span>
            <p className="italic">&quot;{meetup.description}&quot;</p>
          </div>
        </div>

        {/* Right: RSVP & Waitlist lists */}
        <div className="max-h-[300px] scrollbar-thin space-y-4 overflow-y-auto pr-2">
          {/* Confirmed list */}
          <div className="space-y-2">
            <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
              <Users className="h-3.5 w-3.5 text-emerald-500" /> Confirmed Attendees (
              {meetup.registrationsCount})
            </span>
            {isLoading ? (
              <div className="text-muted-foreground py-2 text-center text-xs">
                Loading roster...
              </div>
            ) : !roster?.registrations?.length ? (
              <div className="text-muted-foreground bg-muted/15 rounded-lg py-2 text-center text-xs italic">
                No parents registered yet.
              </div>
            ) : (
              <div className="divide-border/40 bg-muted/20 border-border/30 divide-y rounded-xl border px-3 py-1.5">
                {roster.registrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between py-2 text-xs font-semibold"
                  >
                    <span>{reg.userName}</span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-500"
                    >
                      Confirmed
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Waitlist list */}
          {meetup.waitlistCount > 0 && (
            <div className="space-y-2">
              <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
                <ListFilter className="h-3.5 w-3.5 text-amber-500" /> Waitlisted Parents (
                {meetup.waitlistCount})
              </span>
              {roster?.waitlist && (
                <div className="divide-border/40 bg-muted/20 border-border/30 divide-y rounded-xl border px-3 py-1.5">
                  {roster.waitlist.map((wait) => (
                    <div
                      key={wait.id}
                      className="flex items-center justify-between py-2 text-xs font-semibold"
                    >
                      <span>{wait.userName}</span>
                      <span className="text-[10px] font-bold text-amber-500">
                        Position #{wait.queuePosition}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-border/50 flex justify-end border-t pt-4">
        <Button
          onClick={onClose}
          className="h-10 rounded-xl bg-indigo-600 font-medium text-white hover:bg-indigo-700"
        >
          Close Details
        </Button>
      </div>
    </div>
  );
};

export default MeetupsPage;
