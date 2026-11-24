'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateOrderMutation } from '../hooks/useOrders';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { toast } from 'sonner';

import OrderForm from '../components/OrderForm';

import type { CreateOrderFormValues } from '../schemas';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createOrder } = useCreateOrderMutation();

  const handleSubmit = async (values: CreateOrderFormValues) => {
    try {
      setIsSubmitting(true);

      createOrder(values, {
        onSuccess: (newOrder) => {
          setIsSubmitting(false);

          toast.success(`Order "${newOrder.title}" created successfully!`);

          navigate('/orders');
        },

        onError: (error: unknown) => {
          setIsSubmitting(false);

          toast.error(error instanceof Error ? error.message : 'Failed to create order');
        },
      });
    } catch (error) {
      setIsSubmitting(false);

      toast.error(error instanceof Error ? error.message : 'Failed to create order');
    }
  };

  const handleCancel = () => {
    navigate('/orders');
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create New Order</h1>

          <p className="text-muted-foreground text-sm font-medium">
            Create a new order for a resource purchase.
          </p>
        </div>
      </div>

      {/* Form */}
      <OrderForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateOrderPage;
