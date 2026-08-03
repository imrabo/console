import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMemorySchema, type CreateMemoryFormValues } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateMemoryFormProps {
  onSubmit: (values: CreateMemoryFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateMemoryFormValues>;
}

export const CreateMemoryForm: React.FC<CreateMemoryFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
}) => {
  const { register, handleSubmit, formState } = useForm<CreateMemoryFormValues>(
    {
      resolver: zodResolver(createMemorySchema) as any,
      defaultValues: {
        title: defaultValues?.title || "",
        description: defaultValues?.description || "",
        speakerName: defaultValues?.speakerName || "",
        speakerDesignation: defaultValues?.speakerDesignation || "",
        scheduledAt: defaultValues?.scheduledAt || "",
        meetingUrl: defaultValues?.meetingUrl || "",
        thumbnailUrl:
          defaultValues?.thumbnailUrl ||
          "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
        status: defaultValues?.status,
      },
    },
  );

  const { errors } = formState;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[75vh] space-y-6 p-6 text-left font-sans"
    >
      <div className="space-y-1">
        <Label
          htmlFor="wTitle"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Memory Title
        </Label>
        <Input
          id="wTitle"
          placeholder="Positive Parenting Under Stress"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-xs font-semibold">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="wDesc"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Description
        </Label>
        <Input
          id="wDesc"
          placeholder="Detailed outline of topics to be covered during this lecture..."
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs font-semibold">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="wSpeaker"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Speaker Name
          </Label>
          <Input
            id="wSpeaker"
            placeholder="Dr. Elena Rostova"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("speakerName")}
          />
          {errors.speakerName && (
            <p className="text-destructive text-xs font-semibold">
              {errors.speakerName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="wTitleSpeaker"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Speaker Credentials / Title
          </Label>
          <Input
            id="wTitleSpeaker"
            placeholder="Child Psychologist & Author"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("speakerDesignation")}
          />
          {errors.speakerDesignation && (
            <p className="text-destructive text-xs font-semibold">
              {errors.speakerDesignation.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="wDate"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Date
          </Label>
          <Input
            id="wDate"
            type="date"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("scheduledAt")}
          />
          {errors.scheduledAt && (
            <p className="text-destructive text-xs font-semibold">
              {errors.scheduledAt.message}
            </p>
          )}
        </div>
        {/* 
        <div className="space-y-1">
          <Label htmlFor="wTime" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time Slot</Label>
          <Input
            id="wTime"
            placeholder="07:00 PM EST"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('time')}
          />
          {errors.time && (
            <p className="text-xs font-semibold text-destructive">{errors.time.message}</p>
          )}
        </div> */}

        {/* <div className="space-y-1">
          <Label
            htmlFor="wDuration"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Duration (Min)
          </Label>
          <Input
            id="wDuration"
            type="number"
            placeholder="60"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register('endAt')}
          />
          {errors.endAt && (
            <p className="text-destructive text-xs font-semibold">{errors.endAt.message}</p>
          )}
        </div> */}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="wZoom"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Zoom Memory Link
        </Label>
        <Input
          id="wZoom"
          placeholder="https://zoom.us/j/123456789"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("meetingUrl")}
        />
        {errors.meetingUrl && (
          <p className="text-destructive text-xs font-semibold">
            {errors.meetingUrl.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="wImage"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Cover Image URL
          </Label>
          <Input
            id="wImage"
            placeholder="https://images.unsplash.com/..."
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("thumbnailUrl")}
          />
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="wStatus"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Status
          </Label>
          <select
            id="wStatus"
            className="border-input bg-background flex h-10 w-full rounded-xl border px-3 py-2 text-sm focus-visible:outline-none"
            {...register("status")}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
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
          {isSubmitting ? "Saving Memory..." : "Save Memory"}
        </Button>
      </div>
      <div></div>
    </form>
  );
};
export default CreateMemoryForm;
