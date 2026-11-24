'use client';

import React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createOrderSchema, CreateOrderFormValues, updateOrderSchema } from '../schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FormWrapper } from '@/components/wrappers/FormWrapper';

import { OrderStatus } from '../types';

interface OrderFormProps {
  onSubmit: (values: CreateOrderFormValues) => void | Promise<void>;

  onCancel: () => void;

  isSubmitting?: boolean;

  defaultValues?: Partial<CreateOrderFormValues>;

  isEditMode?: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
  isEditMode = false,
}) => {
  const schema = isEditMode ? updateOrderSchema : createOrderSchema;

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<CreateOrderFormValues>,

    defaultValues: {
      userId: '',
      resourceId: '',
      creatorId: '',
      title: '',
      amount: 0,
      currency: 'INR',
      status: OrderStatus.pending,
      paymentId: '',
      paymentMethod: '',
      ...defaultValues,
    },

    mode: 'onChange',
  });

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const status = watch('status');

  return (
    <FormWrapper
      form={form}
      title={isEditMode ? 'Edit Order' : 'Create Order'}
      description={
        isEditMode
          ? 'Update order information and payment status.'
          : 'Create a new resource order for a user.'
      }
      submitting={isSubmitting}
      showFooter={false}
      onSubmit={onSubmit}
    >
      <div className="space-y-6 text-left font-sans">
        {/* User / Resource / Creator */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* User ID */}
          <div className="space-y-1">
            <Label
              htmlFor="userId"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              User ID
            </Label>

            <Input
              id="userId"
              placeholder="Enter user ID"
              className="h-10 focus-visible:ring-indigo-500/30"
              disabled={isSubmitting || isEditMode}
              readOnly={isEditMode}
              {...register('userId')}
            />

            {errors.userId && (
              <p className="text-destructive text-xs font-semibold">
                {errors.userId.message as string}
              </p>
            )}
          </div>

          {/* Resource ID */}
          <div className="space-y-1">
            <Label
              htmlFor="resourceId"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Resource ID
            </Label>

            <Input
              id="resourceId"
              placeholder="Enter resource ID"
              className="h-10 focus-visible:ring-indigo-500/30"
              disabled={isSubmitting || isEditMode}
              readOnly={isEditMode}
              {...register('resourceId')}
            />

            {errors.resourceId && (
              <p className="text-destructive text-xs font-semibold">
                {errors.resourceId.message as string}
              </p>
            )}
          </div>

          {/* Creator ID */}
          <div className="space-y-1">
            <Label
              htmlFor="creatorId"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Creator ID
            </Label>

            <Input
              id="creatorId"
              placeholder="Enter creator ID"
              className="h-10 focus-visible:ring-indigo-500/30"
              disabled={isSubmitting || isEditMode}
              readOnly={isEditMode}
              {...register('creatorId')}
            />

            {errors.creatorId && (
              <p className="text-destructive text-xs font-semibold">
                {errors.creatorId.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <Label
            htmlFor="title"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Order Title
          </Label>

          <Input
            id="title"
            placeholder="Enter order title"
            className="h-10 focus-visible:ring-indigo-500/30"
            disabled={isSubmitting}
            {...register('title')}
          />

          {errors.title && (
            <p className="text-destructive text-xs font-semibold">
              {errors.title.message as string}
            </p>
          )}

          <p className="text-muted-foreground text-xs">
            Usually this should match the purchased resource title.
          </p>
        </div>

        {/* Amount / Currency / Status */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Amount */}
          <div className="space-y-1">
            <Label
              htmlFor="amount"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Amount
            </Label>

            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="h-10 focus-visible:ring-indigo-500/30"
              disabled={isSubmitting}
              {...register('amount', {
                valueAsNumber: true,
              })}
            />

            {errors.amount && (
              <p className="text-destructive text-xs font-semibold">
                {errors.amount.message as string}
              </p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-1">
            <Label
              htmlFor="currency"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Currency
            </Label>

            <Input
              id="currency"
              placeholder="INR"
              className="h-10 uppercase focus-visible:ring-indigo-500/30"
              disabled={isSubmitting}
              {...register('currency')}
            />

            {errors.currency && (
              <p className="text-destructive text-xs font-semibold">
                {errors.currency.message as string}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label
              htmlFor="status"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Status
            </Label>

            <Select
              value={status}
              onValueChange={(value) => {
                setValue('status', value as OrderStatus, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10 focus-visible:ring-indigo-500/30">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(OrderStatus).map((orderStatus) => (
                  <SelectItem key={orderStatus} value={orderStatus}>
                    {orderStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.status && (
              <p className="text-destructive text-xs font-semibold">
                {errors.status.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Payment Information</h3>

            <p className="text-muted-foreground text-xs">
              Payment information can be added when available.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Payment ID */}
            <div className="space-y-1">
              <Label
                htmlFor="paymentId"
                className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
              >
                Payment ID
              </Label>

              <Input
                id="paymentId"
                placeholder="Enter payment transaction ID"
                className="h-10 focus-visible:ring-indigo-500/30"
                disabled={isSubmitting}
                {...register('paymentId')}
              />

              {errors.paymentId && (
                <p className="text-destructive text-xs font-semibold">
                  {errors.paymentId.message as string}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <Label
                htmlFor="paymentMethod"
                className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
              >
                Payment Method
              </Label>

              <Input
                id="paymentMethod"
                placeholder="e.g. Razorpay, UPI, Card"
                className="h-10 focus-visible:ring-indigo-500/30"
                disabled={isSubmitting}
                {...register('paymentMethod')}
              />

              {errors.paymentMethod && (
                <p className="text-destructive text-xs font-semibold">
                  {errors.paymentMethod.message as string}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Mode Information */}
        {isEditMode && (
          <div className="border-border/50 bg-muted/30 rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">
              User ID, Resource ID, and Creator ID are locked because they identify the original
              order relationship.
            </p>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="border-border/50 flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </div>
    </FormWrapper>
  );
};

export default OrderForm;
