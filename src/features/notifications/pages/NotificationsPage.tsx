import React from 'react';

export const NotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Push & Broadcast Notifications</h1>
      <p className="text-muted-foreground">
        Broadcast push alerts, schedule upcoming events, and log delivery metrics.
      </p>
    </div>
  );
};

export default NotificationsPage;
