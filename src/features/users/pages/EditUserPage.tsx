"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UserForm } from "../components/UserForm";
import type { EditUserFormValues } from "../schemas";
import { useUpdateUserMutation, useUserQuery } from "../hooks/useUsers";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUserPage() {
  const router = useNavigate();
  const params = useParams();

  const userId = params.id as string;

  const { data: user, isLoading } = useUserQuery(userId);
  const updateUser = useUpdateUserMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const handleSubmit = (values: EditUserFormValues) => {
    updateUser.mutate(
      {
        id: userId,
        data: values,
      },
      {
        onSuccess: () => {
          router("/users");
        },
      },
    );
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <Button variant="ghost" onClick={() => router(-1)} className="mb-3">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Edit User</h1>

        <p className="text-muted-foreground">{user.fullName}</p>
      </div>

      <UserForm
        mode="edit"
        defaultValues={{
          fullName: user.fullName,
          email: user.email,
          mobileNo: user.mobileNo,
          membershipType: user.membershipType,
          status: user.status,
          isActive: user.isActive,
          isExpert: user.isExpert,
          gender: user.gender,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router(-1)}
        isSubmitting={updateUser.isPending}
      />
    </div>
  );
}
