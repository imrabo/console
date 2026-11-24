'use client';

import { useQuery } from '@tanstack/react-query';
import dashboardService from '../services/dashboard.service';
import type { DashboardFilters } from '../types/dashboard.types';

export const dashboardOverviewQueryKey = (filters: DashboardFilters) =>
  ['dashboard', 'overview', filters] as const;

export function useDashboardOverview(filters: DashboardFilters) {
  return useQuery({
    queryKey: dashboardOverviewQueryKey(filters),
    queryFn: () => dashboardService.fetchOverview(filters),
  });
}
