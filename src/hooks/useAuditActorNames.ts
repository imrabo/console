'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export function useAuditActorNames(actorIds: Array<string | undefined>) {
  const ids = [...new Set(actorIds.filter((id): id is string => Boolean(id)))].sort();

  return useQuery({
    queryKey: ['audit-actor-names', ids],
    queryFn: () =>
      apiClient.get<Record<string, string | null>>(
        `/audit-actors?ids=${encodeURIComponent(ids.join(','))}`
      ),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function auditActorName(
  actorId: string | undefined,
  names: Record<string, string | null> | undefined
) {
  return actorId ? names?.[actorId] || 'Not available' : 'Not available';
}
