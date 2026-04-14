"use client";

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export function ConnectionTest({ userId }: { userId?: number }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [connectionState, setConnectionState] = useState('unknown');

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (!userId) {
      addLog('❌ No userId provided');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      addLog('❌ No auth token found');
      return;
    }

    addLog(`✅ User ID: ${userId}`);
    addLog(`✅ Token: ${token.substring(0, 20)}...`);
    addLog(`✅ Pusher Key: ${process.env.NEXT_PUBLIC_PUSHER_APP_KEY}`);
    addLog(`✅ Pusher Cluster: ${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}`);

    // Test 1: Direct Pusher connection
    addLog('🔄 Testing direct Pusher connection...');
    
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
      forceTLS: true,
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}/api/broadcasting/auth`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        customHandler: (params, callback) => {
          fetch(params.authEndpoint!, {
            method: 'POST',
            headers: {
              ...params.authOptions!.headers,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              socket_id: params.socketId,
              channel_name: params.channelName,
            }),
          })
            .then((response) => {
              addLog(`📡 Auth response status: ${response.status}`);
              return response.json();
            })
            .then((data) => {
              addLog(`📡 Auth response data: ${JSON.stringify(data)}`);
              
              // Handle wrapped response
              let authData = data;
              
              // If response is wrapped in 'data' key
              if (data.data && typeof data.data === 'object') {
                authData = data.data;
                addLog('📦 Unwrapped data from response');
              }
              
              // If response has 'success' wrapper
              if (data.success && data.auth) {
                authData = { auth: data.auth };
                addLog('📦 Extracted auth from success wrapper');
              }
              
              // Ensure we have the auth key
              if (!authData.auth) {
                addLog(`❌ No auth key found in response!`);
                callback(new Error('Invalid auth response format'), null);
                return;
              }
              
              addLog(`✅ Auth key found: ${authData.auth.substring(0, 20)}...`);
              callback(null, authData);
            })
            .catch((error) => {
              addLog(`❌ Auth request failed: ${error.message}`);
              callback(error, null);
            });
        },
      },
    });

    pusher.connection.bind('connecting', () => {
      addLog('🔄 Pusher: Connecting...');
      setConnectionState('connecting');
    });

    pusher.connection.bind('connected', () => {
      addLog('✅ Pusher: Connected!');
      setConnectionState('connected');
    });

    pusher.connection.bind('unavailable', () => {
      addLog('❌ Pusher: Unavailable');
      setConnectionState('unavailable');
    });

    pusher.connection.bind('failed', () => {
      addLog('❌ Pusher: Failed');
      setConnectionState('failed');
    });

    pusher.connection.bind('disconnected', () => {
      addLog('⚠️ Pusher: Disconnected');
      setConnectionState('disconnected');
    });

    pusher.connection.bind('error', (error: any) => {
      addLog(`🚨 Pusher Error: ${JSON.stringify(error)}`);
    });

    // Test 2: Subscribe to channel
    addLog(`🔄 Subscribing to channel: notifications.${userId}`);
    const channel = pusher.subscribe(`private-notifications.${userId}`);

    channel.bind('pusher:subscription_succeeded', () => {
      addLog('✅ Channel subscription succeeded!');
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      addLog(`❌ Channel subscription error: ${JSON.stringify(error)}`);
    });

    // Test 3: Listen for notifications
    channel.bind('notification.created', (data: any) => {
      addLog(`🎉 NOTIFICATION RECEIVED: ${JSON.stringify(data)}`);
    });

    return () => {
      addLog('🧹 Cleaning up...');
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId]);

  return (
    <div className="fixed top-20 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto z-50 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">🔍 Connection Test</h3>
        <div className={`px-2 py-1 rounded text-xs font-bold ${
          connectionState === 'connected' ? 'bg-green-100 text-green-800' :
          connectionState === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {connectionState}
        </div>
      </div>
      <div className="space-y-1 text-xs font-mono">
        {logs.length === 0 ? (
          <div className="text-gray-500">Waiting for logs...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="border-b border-gray-100 pb-1">
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}