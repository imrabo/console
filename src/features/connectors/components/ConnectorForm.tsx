"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createConnectorSchema,
  type CreateConnectorFormValues,
  updateConnectorSchema,
} from "../schemas";
import {
  ConnectorCategoryEnum,
  ConnectorFileTypeEnum,
} from "../types/connector.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConnectorFormProps {
  onSubmit: (values: CreateConnectorFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateConnectorFormValues>;
  isEditMode?: boolean;
}

export const ConnectorForm: React.FC<ConnectorFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
  isEditMode = false,
}) => {
  const schema = isEditMode ? updateConnectorSchema : createConnectorSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateConnectorFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: ConnectorCategoryEnum.GUIDES,
      fileType: ConnectorFileTypeEnum.PDF,
      thumbnail: "",
      url: "",
      isPremium: false,
      creatorId: "",
      ...defaultValues,
    },
  });

  const isPremium = watch("isPremium");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 text-left font-sans"
    >
      {/* Title */}
      <div className="space-y-1">
        <Label
          htmlFor="title"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Connector Title
        </Label>
        <Input
          id="title"
          placeholder="Enter connector title (e.g., Toddler Milestone Tracker)"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-xs font-semibold">
            {errors.title.message as string}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label
          htmlFor="description"
          className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
        >
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Enter a detailed description of the connector..."
          className="min-h-[100px] focus-visible:ring-indigo-500/30"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-destructive text-xs font-semibold">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {/* Grid Layout for Category, Type, and Premium Toggle */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Category */}
        <div className="space-y-1">
          <Label
            htmlFor="category"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Category
          </Label>
          <Select
            {...register("category")}
            defaultValue={defaultValues.category}
          >
            <SelectTrigger className="h-10 focus-visible:ring-indigo-500/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ConnectorCategoryEnum).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-destructive text-xs font-semibold">
              {errors.category.message as string}
            </p>
          )}
        </div>

        {/* File Type */}
        <div className="space-y-1">
          <Label
            htmlFor="fileType"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            File Type
          </Label>
          <Select
            {...register("fileType")}
            defaultValue={defaultValues.fileType}
          >
            <SelectTrigger className="h-10 focus-visible:ring-indigo-500/30">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ConnectorFileTypeEnum).map((fileType) => (
                <SelectItem key={fileType} value={fileType}>
                  {fileType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fileType && (
            <p className="text-destructive text-xs font-semibold">
              {errors.fileType.message as string}
            </p>
          )}
        </div>

        {/* Premium Toggle */}
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            Premium Connector
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              {...register("isPremium")}
              defaultChecked={defaultValues.isPremium}
            />
            <span className="text-xs font-medium">
              {isPremium ? "Premium (Paid)" : "Free"}
            </span>
          </div>
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Thumbnail URL */}
        <div className="space-y-1">
          <Label
            htmlFor="thumbnail"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Thumbnail URL
          </Label>
          <Input
            id="thumbnail"
            placeholder="https://example.com/thumbnail.jpg"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("thumbnail")}
          />
          {errors.thumbnail && (
            <p className="text-destructive text-xs font-semibold">
              {errors.thumbnail.message as string}
            </p>
          )}
          {watch("thumbnail") && (
            <img
              src={watch("thumbnail")}
              alt="Thumbnail preview"
              className="mt-2 h-20 w-20 rounded-lg object-cover"
            />
          )}
        </div>

        {/* Connector URL */}
        <div className="space-y-1">
          <Label
            htmlFor="url"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Connector URL
          </Label>
          <Input
            id="url"
            placeholder="https://example.com/connector.pdf"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("url")}
          />
          {errors.url && (
            <p className="text-destructive text-xs font-semibold">
              {errors.url.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Creator ID (hidden in create mode, shown in edit mode) */}
      {isEditMode && (
        <div className="space-y-1">
          <Label
            htmlFor="creatorId"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Creator ID
          </Label>
          <Input
            id="creatorId"
            placeholder="Creator user ID"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("creatorId")}
            readOnly
          />
        </div>
      )}

      {/* Submit Buttons */}
      <div className="border-border/50 flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Connector"
              : "Create Connector"}
        </Button>
      </div>
    </form>
  );
};

export default ConnectorForm;
