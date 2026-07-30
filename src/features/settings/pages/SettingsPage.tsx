import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure global application settings.</p>
      </div>

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic application information.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Application Name</Label>
            <Input defaultValue="Hugged" />
          </div>

          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input defaultValue="support@hugged.com" />
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input defaultValue="Asia/Kolkata" />
          </div>
        </CardContent>
      </Card>

      {/* Mobile App */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile App</CardTitle>
          <CardDescription>Version and maintenance settings.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Minimum Android Version</Label>
              <Input placeholder="1.0.0" />
            </div>

            <div className="space-y-2">
              <Label>Minimum iOS Version</Label>
              <Input placeholder="1.0.0" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Force Update</Label>
              <p className="text-muted-foreground text-sm">
                Require users to update before using the app.
              </p>
            </div>

            <Switch />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-muted-foreground text-sm">Temporarily disable app access.</p>
            </div>

            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Maintenance Message</Label>
            <Textarea placeholder="We'll be back shortly..." />
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Enable or disable application modules.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {['Community', 'Resources', 'Meetups', 'Webinars'].map((feature) => (
            <div key={feature} className="flex items-center justify-between rounded-lg border p-4">
              <Label>{feature}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>Application runtime information.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="Environment" value={process.env.NODE_ENV} />

          <Info label="App Version" value={process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0'} />

          <Info label="Build" value={process.env.NEXT_PUBLIC_BUILD_NUMBER ?? '100'} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-lg border p-4">
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className="mt-1 font-medium">{value}</p>
  </div>
);

export default SettingsPage;
