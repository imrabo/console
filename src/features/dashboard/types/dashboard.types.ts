export type DashboardMetricValue = number | null;

export interface DashboardDateRange {
  from: string;
  to: string;
  comparisonFrom: string;
  comparisonTo: string;
}

export interface DashboardMetric {
  value: DashboardMetricValue;
  comparisonPercentage: number | null;
}

export interface DashboardOverview {
  generatedAt: string;
  range: DashboardDateRange;
  summary: {
    users: DashboardMetric;
    communities: DashboardMetric;
    meetups: DashboardMetric;
    webinars: DashboardMetric;
    pendingModeration: DashboardMetric;
  };
  activity: {
    newUsers: DashboardMetric;
    newCommunities: DashboardMetric;
    newMeetups: DashboardMetric;
    newWebinars: DashboardMetric;
  };
  unsupported: {
    retention: null;
    revenue: null;
    notifications: null;
    productHealth: null;
  };
  trend: Array<{
    date: string;
    users: number;
    communities: number;
    meetups: number;
    webinars: number;
  }>;
}

export interface DashboardFilters extends Record<string, string | undefined> {
  from?: string;
  to?: string;
}
