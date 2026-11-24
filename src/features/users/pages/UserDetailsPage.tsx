'use client';

import { Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { DetailSection } from '@/components/custom/detail-section';
import { DetailGrid } from '@/components/custom/detail-grid';
import { StatusBadge } from '@/components/StatusBadge';

import type { UserType } from '../types';
import { formatDateTime } from '@/utils/date';
import { auditActorName, useAuditActorNames } from '@/hooks/useAuditActorNames';

function formatEnum(value?: string | null): string {
  if (!value) return '-';

  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAuditDate(value?: Date | string | null): string {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return formatDateTime(date);
}

export function UserDetailsPage({ user }: { user: UserType }) {
  const { data: auditNames } = useAuditActorNames([user.createdBy, user.updatedBy, user.deletedBy]);
  const isActive = user.isActive;

  const initials =
    user.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      {/* Personal Information */}
      <DetailSection
        title="Personal Information"
        description="User identity and contact details."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge
              status={isActive ? 'active' : 'inactive'}
              label={isActive ? 'Active' : 'Inactive'}
            />
          </div>
        }
      >
        <div className="mb-4 flex items-center gap-4 rounded-lg border p-4">
          {user.profileImageUrl ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full border">
              <img
                src={user.profileImageUrl}
                alt={`${user.fullName || 'User'} profile`}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate font-semibold">{user.fullName || 'Unnamed User'}</h3>

            <p className="text-muted-foreground text-sm break-all">{user.email || '-'}</p>
          </div>
        </div>

        <DetailGrid
          columns={2}
          items={[
            {
              label: 'Full Name',
              value: user.fullName || '-',
            },
            {
              label: 'Email Address',
              value: user.email || '-',
            },
            {
              label: 'Phone Number',
              value: user.phoneNumber || '-',
            },
            {
              label: 'Gender',
              value: formatEnum(user.gender),
            },
          ]}
        />
      </DetailSection>

      {/* Account Information */}
      <DetailSection title="Account Information" description="Membership and account privileges.">
        <DetailGrid
          columns={2}
          items={[
            {
              label: 'Membership Type',
              value: formatEnum(user.membershipType),
            },
            {
              label: 'Expert',
              value: (
                <Badge variant={user.isExpert ? 'default' : 'secondary'}>
                  {user.isExpert ? 'Yes' : 'No'}
                </Badge>
              ),
            },
            {
              label: 'Account Status',
              value: (
                <StatusBadge
                  status={isActive ? 'active' : 'inactive'}
                  label={isActive ? 'Active' : 'Inactive'}
                />
              ),
            },
            {
              label: 'Joined On',
              value: formatAuditDate(user.createdAt),
            },
          ]}
        />
      </DetailSection>

      {/* Audit Information */}
      <DetailSection
        title="Audit Information"
        description="Account creation and modification timestamps."
      >
        <DetailGrid
          columns={2}
          items={[
            {
              label: 'Account Created',
              value: formatAuditDate(user.createdAt),
            },
            {
              label: 'Last Updated',
              value: formatAuditDate(user.updatedAt),
            },
            {
              label: 'Created By',
              value: auditActorName(user.createdBy, auditNames),
            },
            {
              label: 'Updated By',
              value: auditActorName(user.updatedBy, auditNames),
            },
            {
              label: 'Last Suspended At',
              value: formatAuditDate(user.suspendedAt),
            },
            {
              label: 'Last Suspended By',
              value: user.suspendedBy || '-',
            },
            {
              label: 'Last Deleted At',
              value: formatAuditDate(user.deletedAt),
            },
            {
              label: 'Last Deleted By',
              value: auditActorName(user.deletedBy, auditNames),
            },
          ]}
        />
      </DetailSection>

      {/* Children */}
      <DetailSection
        title="Children"
        description="Child profiles associated with this user."
        actions={<Badge variant="secondary">{user.children?.length ?? 0}</Badge>}
      >
        {user.children?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {user.children.map((child, index) => (
              <Card key={`${child.name}-${index}`}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
                      <Users className="text-muted-foreground size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium break-words">{child.name || 'Unnamed Child'}</p>

                      <p className="text-muted-foreground text-sm">Child Profile</p>
                    </div>
                  </div>

                  {child.gender && <Badge variant="secondary">{formatEnum(child.gender)}</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
            <Users className="text-muted-foreground mb-3 size-8" />

            <h3 className="font-medium">No children added</h3>

            <p className="text-muted-foreground mt-1 text-sm">
              This user has not added any child profiles yet.
            </p>
          </div>
        )}
      </DetailSection>
    </div>
  );
}
