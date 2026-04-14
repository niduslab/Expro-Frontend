import { useState, useEffect, useCallback } from 'react';
import { getEcho, getConnectionState } from '@/lib/echo';
import { apiRequest } from '@/lib/api/axios';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  icon: string;
  action_url: string | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export function useNotifications(userId?: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] = useState('disconnected');

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await apiRequest.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await apiRequest.get('/notifications/unread-count');
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await apiRequest.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiRequest.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      await apiRequest.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [notifications]);

  // Fetch initial data
  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId, fetchNotifications, fetchUnreadCount]);

  // Setup real-time listener
  useEffect(() => {
    if (!userId) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    try {
      const echo = getEcho(token);
      const channelName = `notifications.${userId}`;
      
      const channel = echo.private(channelName);

      // Update connection state
      const updateConnectionState = () => {
        const state = getConnectionState();
        setConnectionState(state);
      };

      updateConnectionState();
      const stateInterval = setInterval(updateConnectionState, 5000);

      channel.listen('.notification.created', (data: Notification) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        clearInterval(stateInterval);
        channel.stopListening('.notification.created');
      };
    } catch (error) {
      console.error('Error setting up real-time notifications:', error);
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    connectionState,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
}
