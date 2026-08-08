import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateConnectorMutation } from "../hooks/useConnector";
import { CreateConnectorForm } from "../components/CreateConnectorForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const CreateConnectorPage: React.FC = () => {
  const router = useNavigate();
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createConnector } = useCreateConnectorMutation();

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);

    // Add creatorId from current user if available
    const submissionData = {
      ...values,
      creatorId: currentUser?.id || values.creatorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
    };

    createConnector(submissionData as any, {
      onSuccess: (newConnector) => {
        setIsSubmitting(false);
        toast.success(
          `Connector "${newConnector.title}" created successfully!`,
        );
        router("/connectors");
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(error.message || "Failed to create connector");
      },
    });
  };

  const handleCancel = () => {
    router("/connectors");
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Create New Connector
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Add educational materials, templates, or digital downloads to the
            platform.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
        <CreateConnectorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          defaultValues={{
            creatorId: currentUser?.id || "",
          }}
        />
      </div>
    </div>
  );
};

export default CreateConnectorPage;
