import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/axios';

/**
 * Dashboard Statistics Types
 */
export interface DashboardStats {
  total_members: number;
  active_members: number;
  pending_applications: number;
  total_revenue: number;
  monthly_revenue: number;
  total_projects: number;
  active_projects: number;
}

/**
 * Hook: Get Dashboard Statistics (Admin)
 * Fetches dashboard statistics for admin panel
 * 
 * @returns React Query result with dashboard stats
 * 
 * @example
 * const { data, isLoading } = useDashboardStats();
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiRequest.get<DashboardStats>('/admin/dashboard/stats');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
};
