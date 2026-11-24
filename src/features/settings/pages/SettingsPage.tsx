'use client';

import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Configure global application settings.</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how the Admin Console should appear.</CardDescription>
        </CardHeader>

        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>Application runtime information.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="Environment" value={import.meta.env.MODE.toUpperCase()} />

          <Info label="App Version" value={import.meta.env.VITE_APP_VERSION ?? '1.0.0'} />

          <Info label="Build" value={import.meta.env.VITE_BUILD_NUMBER ?? '100'} />
        </CardContent>
      </Card>
    </div>
  );
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark));
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <label htmlFor="theme-select" className="font-medium">
          Theme
        </label>
        <p className="text-muted-foreground text-sm">Choose the appearance of the Admin Console.</p>
      </div>

      <Select value={theme} onValueChange={(value) => setTheme(value as typeof theme)}>
        <SelectTrigger id="theme-select" className="w-[140px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
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
