/* eslint-disable react-hooks/incompatible-library */
import React from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMeetupSchema, CreateMeetupFormValues } from '../schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LeafletMap = dynamic(
  () => import('@/components/maps/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false }
);

interface CreateMeetupFormProps {
  onSubmit: (values: CreateMeetupFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateMeetupFormValues>;
  categories: { id: string; name: string }[];
}

export const CreateMeetupForm: React.FC<CreateMeetupFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
  categories = [],
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMeetupFormValues>({
    resolver: zodResolver(createMeetupSchema) as any,
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      organizerName: defaultValues?.organizerName || '',
      category: defaultValues?.category || '',
      date: defaultValues?.date || '',
      time: defaultValues?.time || '',
      locationName: defaultValues?.locationName || '',
      latitude: defaultValues?.latitude ?? 45.5152, // Default Portland
      longitude: defaultValues?.longitude ?? -122.6784,
      maxRegistrations: defaultValues?.maxRegistrations ?? 10,
    },
  });

  const latVal = watch('latitude');
  const lngVal = watch('longitude');

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    setValue('latitude', Number(coords.lat.toFixed(6)));
    setValue('longitude', Number(coords.lng.toFixed(6)));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[75vh] scrollbar-thin space-y-4 overflow-y-auto pr-2 text-left font-sans"
    >
      <div className="space-y-1">
        <Label
          htmlFor="title"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Meetup Title
        </Label>
        <Input
          id="title"
          placeholder="Sunday Park Picnic & Games"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-destructive text-xs font-semibold">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="description"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Description
        </Label>
        <Input
          id="description"
          placeholder="Bring sandwiches and toys for the kids..."
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-destructive text-xs font-semibold">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="organizerName"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Organizer Name
          </Label>
          <Input
            id="organizerName"
            placeholder="Sarah Connor"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('organizerName')}
          />
          {errors.organizerName && (
            <p className="text-destructive text-xs font-semibold">{errors.organizerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="category"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Category
          </Label>
          <select
            id="category"
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-xl border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            {...register('category')}
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-destructive text-xs font-semibold">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="date"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Date
          </Label>
          <Input
            id="date"
            type="date"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('date')}
          />
          {errors.date && (
            <p className="text-destructive text-xs font-semibold">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="time"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Time
          </Label>
          <Input
            id="time"
            placeholder="10:00 AM"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('time')}
          />
          {errors.time && (
            <p className="text-destructive text-xs font-semibold">{errors.time.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="maxRegistrations"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Capacity
          </Label>
          <Input
            id="maxRegistrations"
            type="number"
            placeholder="15"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('maxRegistrations')}
          />
          {errors.maxRegistrations && (
            <p className="text-destructive text-xs font-semibold">
              {errors.maxRegistrations.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="locationName"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Location Name / Address
        </Label>
        <Input
          id="locationName"
          placeholder="Westmoreland Park, SE McLoughlin Blvd, Portland"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register('locationName')}
        />
        {errors.locationName && (
          <p className="text-destructive text-xs font-semibold">{errors.locationName.message}</p>
        )}
      </div>

      {/* Coordinate Picker and Map Integration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="latitude"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Latitude
          </Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('latitude')}
          />
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="longitude"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Longitude
          </Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('longitude')}
          />
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-muted-foreground mb-1 block text-xs font-bold tracking-wider uppercase">
          Select Coordinates on Map
        </span>
        <div className="border-border h-[200px] overflow-hidden rounded-xl border">
          <LeafletMap
            lat={Number(latVal) || 45.5152}
            lng={Number(lngVal) || -122.6784}
            interactive={true}
            onLocationSelect={handleLocationSelect}
            popupText="Meetup Location Pin"
          />
        </div>
      </div>

      <div className="border-border/50 flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 font-medium text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700"
        >
          {isSubmitting ? 'Scheduling Meetup...' : 'Schedule Event'}
        </Button>
      </div>
    </form>
  );
};
export default CreateMeetupForm;
