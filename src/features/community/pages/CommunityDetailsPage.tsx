'use client';

import { useParams } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Calendar,
  Users,
  User,
  Globe,
  Lock,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Shield,
  Layers,
} from 'lucide-react';
import { useCommunityQuery } from '../hooks/useCommunity';

export default function CommunityDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useCommunityQuery(id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const community = data;

  if (!community) {
    return <div>Community not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{community.name}</h1>

        <p className="text-muted-foreground">{community.description}</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}

        <div className="col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>

              <CardDescription>Community details</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-6">
              <Info icon={<Layers />} title="Type" value={community.type} />

              <Info icon={<Tag />} title="Category" value={community.category || '-'} />

              <Info icon={<Shield />} title="Status" value={community.status} />

              <Info icon={<Users />} title="Members" value={community.memberCount} />

              <Info icon={<User />} title="Owner" value={community.adminId} />

              <Info icon={<Calendar />} title="Created" value={community.createdAt.toString()} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-6">
              <Info icon={<DollarSign />} title="Access" value={community.accessType} />

              <Info
                icon={<DollarSign />}
                title="Price"
                value={community.price ? `${community.currency} ${community.price}` : 'Free'}
              />

              <Info
                icon={<User />}
                title="Additional Admins"
                value={community.adminIds?.length || 0}
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}

        <div className="col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Image</CardTitle>
            </CardHeader>

            <CardContent>
              <Avatar className="h-40 w-40 rounded-xl">
                <AvatarImage src={community.imageUrl} />

                <AvatarFallback>
                  <ImageIcon />
                </AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>

            <CardContent>
              <Badge>
                {community.visibility === 'public' ? (
                  <Globe className="mr-2 h-4 w-4" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}

                {community.visibility}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Created By</p>

                <p>{community.createdByAdminId}</p>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground text-sm">Updated</p>

                <p>{community.updatedAt?.toString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface Props {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}

function Info({ icon, title, value }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">{icon}</div>

      <div>
        <p className="text-muted-foreground text-sm">{title}</p>

        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
