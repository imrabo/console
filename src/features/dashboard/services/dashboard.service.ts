import { apiClient } from '@/lib/api/client';
import type { DashboardFilters, DashboardOverview } from '../types/dashboard.types';

const dashboardService = {
  fetchOverview(filters: DashboardFilters = {}) {
    return apiClient.get<DashboardOverview>('/dashboard/overview', filters);
  },
};

export default dashboardService;
