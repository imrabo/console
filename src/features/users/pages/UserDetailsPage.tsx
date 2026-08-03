import { Edit, Phone, Calendar, Crown, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type UserType } from "../types";

interface UserDetailsPageProps {
  user: UserType;

  onEdit: () => void;

  onDelete: () => void;

  onSuspend: () => void;

  onActivate: () => void;
}

export function UserDetailsPage({
  user,
  onEdit,
  onSuspend,
  onActivate,
}: UserDetailsPageProps) {
  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-28 w-28">
                  {/* <AvatarImage src={user.photoURL} /> */}
                  <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{user.fullName}</h1>

                    <Badge>{user.membershipType}</Badge>

                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mt-2">{user.email}</p>

                  <div className="mt-4 flex gap-6">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />

                      {user.mobileNo}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />

                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  onClick={user.status === "active" ? onSuspend : onActivate}
                >
                  {user.status === "active" ? "Suspend" : "Activate"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <Crown className="text-orange-500" />

            <div className="font-semibold">{user.membershipType}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <User />

            <div className="text-3xl font-bold">
              {user.children?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Shield />

            <div>{user.status}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>

              <TabsTrigger value="profile">Profile</TabsTrigger>

              <TabsTrigger value="children">Children</TabsTrigger>

              <TabsTrigger value="wallet">Wallet</TabsTrigger>

              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <InfoRow label="Status" value={user.status} />

                    <InfoRow label="Membership" value={user.membershipType} />

                    <InfoRow
                      label="Expert"
                      value={user.isExpert ? "Yes" : "No"}
                    />

                    <InfoRow
                      label="Joined"
                      value={new Date(user.createdAt).toLocaleDateString()}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <InfoRow label="Email" value={user.email} />

                    <InfoRow label="Phone" value={user.mobileNo} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <InfoRow label="Full Name" value={user.fullName} />

                    <InfoRow label="Email" value={user.email} />

                    <InfoRow label="Phone" value={user.mobileNo} />

                    <InfoRow label="Gender" value={user.gender || "-"} />

                    {/* <InfoRow
                                        label="Date of Birth"
                                        value={user.dateOfBirth || "-"}
                                    />

                                    <InfoRow
                                        label="Country"
                                        value={user.country || "-"}
                                    />

                                    <InfoRow
                                        label="City"
                                        value={user.city || "-"}
                                    />

                                    <InfoRow
                                        label="Language"
                                        value={user.language || "-"}
                                    /> */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="children">
              <div className="grid gap-4">
                {/* {user.children?.length ? (

                                user.children.map((child) => (

                                    <Card key={child.id}>

                                        <CardContent className="p-6">

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <h3 className="font-semibold text-lg">
                                                        {child.name}
                                                    </h3>



                                                </div>

                                                <Badge>
                                                    {child.gender}
                                                </Badge>

                                            </div>

                                            <Separator className="my-4" />



                                        </CardContent>

                                    </Card>

                                ))

                            ) 
                            
                            : ( */}

                <Card>
                  <CardContent className="text-muted-foreground py-10 text-center">
                    No children added.
                  </CardContent>
                </Card>

                {/* )} */}
              </div>
            </TabsContent>

            <TabsContent value="wallet">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <InfoRow label="Plan" value={user.membershipType} />

                    <InfoRow label="Status" value={user.status} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />

                      <div>
                        <p className="font-medium">Account Created</p>

                        <p className="text-muted-foreground text-sm">
                          {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

                      <div>
                        <p className="font-medium">Membership Activated</p>

                        <p className="text-muted-foreground text-sm">
                          Premium Membership
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-yellow-500" />

                      <div>
                        <p className="font-medium">Last Profile Update</p>

                        <p className="text-muted-foreground text-sm">
                          2 days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <span className="text-muted-foreground text-sm">{label}</span>

      <span className="text-right font-medium">{value || "-"}</span>
    </div>
  );
}
