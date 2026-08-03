"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Gender, MembershipType, UserStatus } from "../types/users.enums";

import { User, Calendar, Shield } from "lucide-react";

import { userFormSchema, type UserFormValues } from "../schemas";

import type { SubmitHandler } from "react-hook-form";
import { FormWrapper } from "@/components/wrappers/FormWrapper";

interface UserFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<UserFormValues>;
  onSubmit: SubmitHandler<UserFormValues>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) {
  // const { register } = useFormContext<UserFormValues>();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),

    defaultValues: {
      fullName: "",
      email: "",
      mobileNo: "",
      membershipType: MembershipType.FREE,

      status: UserStatus.ACTIVE,

      gender: Gender.MALE,

      isActive: true,
      isExpert: false,

      // dateOfBirth: new Date(),

      // children: [],

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...form.getValues(),
        ...defaultValues,
      });
    }
  }, [defaultValues, form]);

  // const children = useFieldArray({
  //   control: form.control,
  //   name: 'children',
  // });

  return (
    <FormProvider {...form}>
      <FormWrapper
        form={form}
        title={mode === "create" ? "Create User" : "Edit User"}
        description="Manage user profile information."

        submitting={isSubmitting}

        submitLabel={mode === "create" ? "Create User" : "Save Changes"}

        onCancel={onCancel}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* BASIC INFO */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <label>Full Name</label>

                <Input {...form.register("fullName")} />

                <p className="text-sm text-red-500">
                  {form.formState.errors.fullName?.message}
                </p>
              </div>

              <div>
                <label>Email</label>

                <Input type="email" {...form.register("email")} />

                <p className="text-sm text-red-500">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              <div>
                <label>Mobile</label>

                <Input {...form.register("mobileNo")} />

                <p className="text-sm text-red-500">
                  {form.formState.errors.mobileNo?.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* PERSONAL */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <label>Gender</label>

                <Select
                  value={form.watch("gender")}
                  onValueChange={(v) => form.setValue("gender", v as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Male</SelectItem>

                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>

                    <SelectItem value={Gender.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ACCOUNT */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <label>Status</label>

                <Select
                  value={form.watch("status")}
                  onValueChange={(v) =>
                    form.setValue("status", v as UserStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>

                    <SelectItem value={UserStatus.SUSPENDED}>
                      Suspended
                    </SelectItem>

                    <SelectItem value={UserStatus.BANNED}>Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  checked={form.watch("isActive")}
                  onCheckedChange={(v) => form.setValue("isActive", !!v)}
                />
                Active User
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  checked={form.watch("isExpert")}
                  onCheckedChange={(v) => form.setValue("isExpert", !!v)}
                />
                Expert User
              </div>
            </CardContent>
          </Card>
          {/* 
          <div>
            <label>Date of Birth</label>

            <Input
              type="date"
              value={
                form.watch('dateOfBirth')
                  ? form.watch('dateOfBirth').toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => form.setValue('dateOfBirth', new Date(e.target.value))}
            />

            <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth?.message}</p>
          </div> */}

          <div>
            <label>Membership</label>

            <Select
              value={form.watch("membershipType")}
              onValueChange={(v) =>
                form.setValue("membershipType", v as MembershipType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={MembershipType.FREE}>Free</SelectItem>

                <SelectItem value={MembershipType.PREMIUM}>Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CHILDREN */}

          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Children
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {children.fields.map((child, index) => (
                <div key={child.id} className="flex gap-3">
                  <Input placeholder="Child name" {...form.register(`children.${index}.name`)} />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => children.remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() =>
                  children.append({
                    name: '',
                    dob: new Date(),
                    gender: Gender.OTHER,
                  })
                }
              >
                Add Child
              </Button>
            </CardContent>
          </Card> */}

          {/* FOOTER */}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create User" : "Update User"}
            </Button>
          </div>
        </form>
      </FormWrapper>
    </FormProvider>
  );
}

/* 
 {process.env.NODE_ENV === "development" && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>React Hook Form Debug</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 text-xs">
                <div>
                  <h3 className="mb-2 font-semibold">Values</h3>

                  { <pre className="bg-muted overflow-auto rounded p-4">
                  {JSON.stringify(form.watch(), null, 2)}
                </pre> }
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Errors</h3>

                  <pre className="overflow-auto rounded bg-red-50 p-4 text-red-700">
                    {JSON.stringify(form.formState.errors, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Dirty Fields</h3>

                  <pre className="bg-muted overflow-auto rounded p-4">
                    {JSON.stringify(form.formState.dirtyFields, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Touched Fields</h3>

                  <pre className="bg-muted overflow-auto rounded p-4">
                    {JSON.stringify(form.formState.touchedFields, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Form State</h3>

                  <pre className="bg-muted overflow-auto rounded p-4">
                    {JSON.stringify(
                      {
                        isDirty: form.formState.isDirty,
                        isValid: form.formState.isValid,
                        isSubmitting: form.formState.isSubmitting,
                        isSubmitted: form.formState.isSubmitted,
                        submitCount: form.formState.submitCount,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

*/
