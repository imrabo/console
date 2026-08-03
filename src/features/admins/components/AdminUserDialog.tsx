"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  type AdminUser,
  type AdminUserFormData,
  adminUserFormSchema,
} from "../schemas";

import {
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
} from "../hooks/useAdmins";

interface AdminUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: AdminUser | null;
}

const defaultValues: AdminUserFormData = {
  fullName: "",
  email: "",
  password: "",
};

export function AdminUserDialog({
  open,
  onOpenChange,
  admin,
}: AdminUserDialogProps) {
  const isEditMode = Boolean(admin);

  const createMutation = useCreateAdminUserMutation();
  const updateMutation = useUpdateAdminUserMutation();

  const form = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues,
    mode: "onSubmit",
  });

  /**
   * Populate form when editing
   */
  useEffect(() => {
    if (!open) return;

    if (admin) {
      form.reset({
        fullName: admin.fullName,
        email: admin.email,
        password: "",
      });

      return;
    }

    form.reset(defaultValues);
  }, [open, admin, form]);

  /**
   * Submit handler
   */
  const handleSubmit = async (values: AdminUserFormData) => {
    try {
      if (isEditMode && admin) {
        const updatePayload: Partial<AdminUserFormData> = {
          fullName: values.fullName,
        };

        if (values.password?.trim()) {
          updatePayload.password = values.password;
        }

        await updateMutation.mutateAsync({
          id: admin.id,
          data: updatePayload,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Admin User" : "Create Admin User"}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Update administrator information."
              : "Create a new administrator account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* Full Name */}
          <Controller
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <div className="space-y-2">
                <label htmlFor="fullName">Full Name</label>
                <Input id="fullName" placeholder="John Doe" {...field} />
              </div>
            )}
          />

          {/* Email */}
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  disabled={isEditMode}
                  {...field}
                />
              </div>
            )}
          />

          {/* Password */}
          <Controller
            control={form.control}
            name="password"
            render={({ field }) => (
              <div className="space-y-2">
                <label htmlFor="password">
                  {isEditMode ? "New Password (Optional)" : "Password"}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminUserDialog;
