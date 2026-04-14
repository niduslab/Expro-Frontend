"use client";

import { useState, useEffect } from 'react';
import { getConnectionState } from '@/lib/echo';

export function NotificationDebug() {
  const [debugInfo, setDebugInfo] = useState({
    token: '',
    userId: '',
    connectionState: 'unknown',
    pusherKey: '',
    pusherCluster: '',
    apiBaseUrl: '',
    authEndpoint: '',
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const token = localStorage.getItem('auth_token');
      const connectionState = getConnectionState();
      
      setDebugInfo({
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        userId: 'Check profile data',
        connectionState,
        pusherKey: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'Not set',
        pusherCluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'Not set',
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set',
        authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}/broadcasting/auth`,
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Notification Debug</h3>
      <div className="space-y-1">
        <div>Token: {debugInfo.token}</div>
        <div>Connection: <span className={`font-bold ${
          debugInfo.connectionState === 'connected' ? 'text-green-400' : 
          debugInfo.connectionState === 'connecting' ? 'text-yellow-400' : 'text-red-400'
        }`}>{debugInfo.connectionState}</span></div>
        <div>Pusher Key: {debugInfo.pusherKey}</div>
        <div>Pusher Cluster: {debugInfo.pusherCluster}</div>
        <div>API URL: {debugInfo.apiBaseUrl}</div>
        <div>Auth Endpoint: {debugInfo.authEndpoint}</div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Check browser console for detailed logs
      </div>
    </div>
  );
}