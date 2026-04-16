import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api/axios';

export interface NotificationLog {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  notification_type: string;
  channel: 'email' | 'sms' | 'push' | 'in_app';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  title: string;
  message: string;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  read_at: string | null;
  error_message: string | null;
  cost: number | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationAnalytics {
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_pending: number;
  delivery_rate: number;
  failure_rate: number;
  total_cost: number;
  by_type: Record<string, number>;
  by_channel: Record<string, number>;
  by_status: Record<string, number>;
  recent_activity: Array<{
    date: string;
    count: number;
  }>;
}

export interface NotificationLogsFilters {
  user_id?: number;
  notification_type?: string;
  channel?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedLogsResponse {
  data: NotificationLog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export function useNotificationLogs(initialFilters?: NotificationLogsFilters) {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: 0,
    to: 0,
  });
  const [filters, setFilters] = useState<NotificationLogsFilters>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (customFilters?: NotificationLogsFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = customFilters || filters;
      const response = await apiRequest.get<PaginatedLogsResponse>('/admin/notification-logs', {
        params,
      });

      setLogs(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      });
    } catch (err: any) {
      console.error('Failed to fetch notification logs:', err);
      setError(err.response?.data?.message || 'Failed to load notification logs');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((newFilters: NotificationLogsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    pagination,
    filters,
    isLoading,
    error,
    updateFilters,
    changePage,
    resetFilters,
    refetch: fetchLogs,
  };
}

export function useNotificationAnalytics(dateRange?: { from?: string; to?: string }) {
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiRequest.get<{ data: NotificationAnalytics }>('/admin/notification-analytics', {
        params: dateRange,
      });

      setAnalytics(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch notification analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
