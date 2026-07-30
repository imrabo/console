'use client';

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Shadcn Field Primitives
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';

import { ModerationType, ModerationAction, ModerationEntityType, ModerationStatus } from '../types';
import { useCreateModerationMutation, useUpdateModerationMutation } from '../hooks/useModeration';
import { moderationFormSchema, ModerationFormValues } from '../schemas';

interface ModerationFormProps {
  initialData?: ModerationType | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ModerationForm: React.FC<ModerationFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const isEditMode = Boolean(initialData);

  const createMutation = useCreateModerationMutation();
  const updateMutation = useUpdateModerationMutation();

  const form = useForm<ModerationFormValues>({
    resolver: zodResolver(moderationFormSchema),
    defaultValues: {
      entityType: initialData?.entityType || ModerationEntityType.GROUP,
      entityId: initialData?.entityId || '',
      ownerId: initialData?.ownerId || '',
      reportedById: initialData?.reportedById || '',
      reason: initialData?.reason || '',
      status: initialData?.status || ModerationStatus.PENDING,
      action: initialData?.action || ModerationAction.NONE,
      assignedModeratorId: initialData?.assignedModeratorId || '',
      moderatorNote: initialData?.moderatorNote || '',
    },
  });

  // Keep form values synchronized if initialData updates dynamically
  useEffect(() => {
    if (initialData) {
      form.reset({
        entityType: initialData.entityType,
        entityId: initialData.entityId,
        ownerId: initialData.ownerId,
        reportedById: initialData.reportedById || '',
        reason: initialData.reason || '',
        status: initialData.status,
        action: initialData.action,
        assignedModeratorId: initialData.assignedModeratorId || '',
        moderatorNote: initialData.moderatorNote || '',
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: ModerationFormValues) => {
    try {
      if (isEditMode && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit moderation form:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const reasonText = form.watch('reason') || '';

  return (
    <div className="space-y-6">
      <form id="moderation-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Section 1: Report Information */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Report Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldGroup className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Entity Type */}
                    <Controller
                      name="entityType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="entityType">Entity Type</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isEditMode || isLoading}
                          >
                            <SelectTrigger id="entityType" aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Select entity type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ModerationEntityType).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key.charAt(0) + key.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Entity ID */}
                    <Controller
                      name="entityId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="entityId">Entity ID</FieldLabel>
                          <Input
                            {...field}
                            id="entityId"
                            placeholder="e.g. ENT-10294"
                            disabled={isEditMode || isLoading}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Owner ID */}
                    <Controller
                      name="ownerId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="ownerId">Owner ID</FieldLabel>
                          <Input
                            {...field}
                            id="ownerId"
                            placeholder="Target user ID"
                            disabled={isEditMode || isLoading}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Reported By */}
                    <Controller
                      name="reportedById"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="reportedById">Reported By</FieldLabel>
                          <Input
                            {...field}
                            id="reportedById"
                            placeholder="Reporter User ID"
                            disabled={isEditMode || isLoading}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  {/* Reason with InputGroup + Character Counter */}
                  <Controller
                    name="reason"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reason">Reason for Report</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="reason"
                            rows={3}
                            placeholder="Describe the issue or policy violation..."
                            disabled={isLoading}
                            aria-invalid={fieldState.invalid}
                            className="min-h-20 resize-none"
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {reasonText.length} characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>

          {/* Section 2: Moderation Workflow */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Moderation & Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldSet>
                <FieldGroup className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Status */}
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="status">Status</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading}
                          >
                            <SelectTrigger id="status" aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ModerationStatus).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key.charAt(0) + key.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Action */}
                    <Controller
                      name="action"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="action">Action Taken</FieldLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isLoading}
                          >
                            <SelectTrigger id="action" aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(ModerationAction).map(([key, value]) => (
                                <SelectItem key={key} value={value}>
                                  {key.charAt(0) + key.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  {/* Assigned Moderator */}
                  <Controller
                    name="assignedModeratorId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="assignedModeratorId">Assigned Moderator</FieldLabel>
                        <Input
                          {...field}
                          id="assignedModeratorId"
                          placeholder="e.g. MOD-8821"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          autoComplete="off"
                        />
                        <FieldDescription>
                          Assign a team member responsible for reviewing this case.
                        </FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Moderator Note */}
                  <Controller
                    name="moderatorNote"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="moderatorNote">Moderator Note</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id="moderatorNote"
                            rows={3}
                            placeholder="Internal audit trail or notes..."
                            disabled={isLoading}
                            aria-invalid={fieldState.invalid}
                            className="min-h-20 resize-none"
                          />
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button type="submit" form="moderation-form" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditMode ? 'Update Case' : 'Create Case'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default ModerationForm;
