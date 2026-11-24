'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { User, UserRound, Shield } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Gender, MembershipType, UserStatus } from '../types/users.enums';

import { COUNTRY_CODES } from '../constants/countryCodes';

import { UserFormInput, userFormSchema, UserFormValues } from '../schemas';

import { FormWrapper } from '@/components/wrappers/FormWrapper';
import { SectionHeading } from '@/components/section-heading';
import { FormField } from '@/components/forms/form-field';

interface UserFormProps {
  mode: 'create' | 'edit';

  defaultValues?: Partial<UserFormValues>;

  onSubmit: (values: UserFormValues) => void | Promise<void>;

  onCancel?: () => void;

  isSubmitting?: boolean;
}

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  const form = useForm<UserFormInput, unknown, UserFormValues>({
    resolver: zodResolver(userFormSchema),

    mode: 'onChange',

    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      membershipType: MembershipType.FREE,
      gender: Gender.MALE,
      isActive: true,
      isExpert: false,
      countryCode: '91',
      profileImageUrl: undefined,

      ...defaultValues,

      status: (defaultValues?.isActive ?? true) ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    },
  });

  const isActive = form.watch('isActive');
  const isExpert = form.watch('isExpert');

  /**
   * Reset form when edit data arrives.
   */
  useEffect(() => {
    if (!defaultValues) {
      return;
    }

    const active = defaultValues.isActive ?? true;

    form.reset({
      fullName: '',
      email: '',
      phoneNumber: '',
      membershipType: MembershipType.FREE,
      gender: Gender.MALE,
      isActive: active,
      isExpert: false,
      countryCode: '91',
      profileImageUrl: undefined,

      ...defaultValues,

      status: active ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    });

  }, [defaultValues, form]);

  /**
   * Keep status synchronized with account access.
   */
  useEffect(() => {
    const expectedStatus = isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED;

    if (form.getValues('status') !== expectedStatus) {
      form.setValue('status', expectedStatus, {
        shouldValidate: true,
      });
    }
  }, [isActive, form]);

  /**
   * Final submit handler.
   */
  const handleFormSubmit = async (values: UserFormValues) => {
    const submitValues: UserFormValues = {
      ...values,

      status: values.isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    };

    await onSubmit(submitValues);
  };

  const isCreateMode = mode === 'create';

  return (
    <FormProvider {...form}>
      <FormWrapper
        form={form}
        showHeader={true}
        showFooter={true}
        showDevelopmentDebug={true}
        submitting={isSubmitting}
        submitLabel={isCreateMode ? 'Create User' : 'Save Changes'}
        title={isCreateMode ? 'Create User' : 'Edit User'}
        description={
          isCreateMode
            ? 'Create a new user account.'
            : 'Update user information and account settings.'
        }
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
      >
        <div className="w-full space-y-5">
          {/* Basic Information */}
          <section className="space-y-3">
            <SectionHeading
              icon={<User className="size-4" />}
              title="Basic Information"
              description="Primary account information"
            />

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              <FormField
                label="Full Name"
                required
                htmlFor="fullName"
                error={form.formState.errors.fullName?.message}
              >
                <Input
                  id="fullName"
                  {...form.register('fullName')}
                  maxLength={50}
                  placeholder="Enter full name"
                  className="h-10"
                />
              </FormField>

              <FormField
                label="Email"
                required
                htmlFor="email"
                error={form.formState.errors.email?.message}
              >
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="Enter email address"
                  className="h-10"
                />
              </FormField>

              <FormField
                label="Country Code"
                required
                error={form.formState.errors.countryCode?.message}
              >
                <Select
                  value={form.watch('countryCode')}
                  onValueChange={(value) =>
                    form.setValue('countryCode', value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select country code" />
                  </SelectTrigger>

                  <SelectContent>
                    {Array.from(
                      new Map(COUNTRY_CODES.map((code) => [code.value, code])).values()
                    ).map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Mobile Number"
                required
                htmlFor="phoneNumber"
                error={form.formState.errors.phoneNumber?.message}
              >
                <Input
                  id="phoneNumber"
                  {...form.register('phoneNumber', {
                    onChange: (event) => {
                      const target = event.target as HTMLInputElement;
                      const digits = target.value.replace(/\D/g, '').slice(0, 10);

                      target.value = digits;

                      form.setValue('phoneNumber', digits, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  className="h-10"
                />
                <p className="text-muted-foreground text-xs">Enter a 10-digit mobile number.</p>
              </FormField>
            </div>
          </section>
          <div className="border-muted-foreground/20 w-full border-t border-dashed" />

          {/* Profile Details */}
          <section className="space-y-3">
            <SectionHeading
              icon={<UserRound className="size-4" />}
              title="Profile Details"
              description="Personal profile information"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Gender" required error={form.formState.errors.gender?.message}>
                <Select
                  value={form.watch('gender')}
                  onValueChange={(value) =>
                    form.setValue('gender', value as Gender, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent position="popper">
                    <SelectItem value={Gender.MALE}>Male</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                    <SelectItem value={Gender.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </section>

          <div className="border-muted-foreground/20 w-full border-t border-dashed" />

          {/* Account & Membership */}
          <section className="space-y-4">
            <SectionHeading
              icon={<Shield className="size-4" />}
              title="Account & Membership"
              description="Membership and access permissions"
            />

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
              <FormField
                label="Membership"
                required
                error={form.formState.errors.membershipType?.message}
              >
                <Select
                  value={form.watch('membershipType')}
                  onValueChange={(value) =>
                    form.setValue('membershipType', value as MembershipType, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>

                  <SelectContent position="popper">
                    <SelectItem value={MembershipType.FREE}>Free</SelectItem>
                    <SelectItem value={MembershipType.PREMIUM}>Premium</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Account Status">
                <div className="flex h-10 items-center">
                  <span
                    className={
                      isActive
                        ? 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300'
                        : 'inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300'
                    }
                  >
                    {isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs">
                  Reflects the current account access state.
                </p>
              </FormField>
            </div>

            {/* Account Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Account Options</h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="bg-muted/40 hover:bg-muted/70 flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(value) =>
                      form.setValue('isActive', Boolean(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="mt-0.5"
                  />

                  <span className="min-w-0 space-y-1">
                    <span className="block text-sm font-medium">Active User</span>
                    <span className="text-muted-foreground block text-xs leading-relaxed">
                      Allow this user to access their account.
                    </span>
                  </span>
                </label>

                <label className="bg-muted/40 hover:bg-muted/70 flex cursor-pointer items-start gap-3 rounded-md p-3 transition-colors">
                  <Checkbox
                    checked={isExpert}
                    onCheckedChange={(value) =>
                      form.setValue('isExpert', Boolean(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="mt-0.5"
                  />

                  <span className="min-w-0 space-y-1">
                    <span className="block text-sm font-medium">Expert User</span>
                    <span className="text-muted-foreground block text-xs leading-relaxed">
                      Mark this user as an expert.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </FormWrapper>
    </FormProvider>
  );
}
