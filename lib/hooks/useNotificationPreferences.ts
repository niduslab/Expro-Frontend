import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api/axios';

export interface NotificationPreference {
  id: number;
  user_id: number;
  notification_type: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferencesResponse {
  data: NotificationPreference[];
}

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiRequest.get<NotificationPreferencesResponse>('/notification-preferences');
      setPreferences(response.data.data || []);
    } catch (err: any) {
      console.error('Failed to fetch notification preferences:', err);
      setError(err.response?.data?.message || 'Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreference = useCallback(async (
    notificationType: string,
    channel: 'email_enabled' | 'sms_enabled' | 'push_enabled' | 'in_app_enabled',
    enabled: boolean
  ) => {
    try {
      const response = await apiRequest.put('/notification-preferences', {
        notification_type: notificationType,
        [channel]: enabled,
      });

      // Optimistically update local state
      setPreferences(prev =>
        prev.map(pref =>
          pref.notification_type === notificationType
            ? { ...pref, [channel]: enabled }
            : pref
        )
      );

      return response.data;
    } catch (err: any) {
      console.error('Failed to update notification preference:', err);
      // Revert optimistic update on error
      await fetchPreferences();
      throw err;
    }
  }, [fetchPreferences]);

  const updateAllChannels = useCallback(async (
    notificationType: string,
    settings: {
      email_enabled?: boolean;
      sms_enabled?: boolean;
      push_enabled?: boolean;
      in_app_enabled?: boolean;
    }
  ) => {
    try {
      const response = await apiRequest.put('/notification-preferences', {
        notification_type: notificationType,
        ...settings,
      });

      // Optimistically update local state
      setPreferences(prev =>
        prev.map(pref =>
          pref.notification_type === notificationType
            ? { ...pref, ...settings }
            : pref
        )
      );

      return response.data;
    } catch (err: any) {
      console.error('Failed to update notification preferences:', err);
      await fetchPreferences();
      throw err;
    }
  }, [fetchPreferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    updateAllChannels,
    refetch: fetchPreferences,
  };
}
