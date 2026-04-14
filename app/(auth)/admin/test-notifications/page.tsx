"use client";

import { useState } from 'react';
import { useMyProfile } from '@/lib/hooks/admin/useUsers';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { getConnectionState } from '@/lib/echo';

export default function TestNotificationsPage() {
  const { data: profile } = useMyProfile();
  const { notifications, unreadCount, connectionState } = useNotifications(profile?.id);
  const [testResult, setTestResult] = useState('');

  const runConnectionTest = () => {
    const token = localStorage.getItem('auth_token');
    const userId = profile?.id;
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const results = [
      `✅ User ID: ${userId || '❌ Missing'}`,
      `✅ Auth Token: ${token ? 'Present' : '❌ Missing'}`,
      `✅ Pusher Key: ${pusherKey || '❌ Missing'}`,
      `✅ Pusher Cluster: ${pusherCluster || '❌ Missing'}`,
      `✅ API Base URL: ${apiBaseUrl || '❌ Missing'}`,
      `✅ Connection State: ${connectionState}`,
      `✅ Notifications Count: ${notifications.length}`,
      `✅ Unread Count: ${unreadCount}`,
    ];
    
    setTestResult(results.join('\n'));
  };

  const testApiCall = async () => {
    try {
      const response = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ API Test Success: ${data.data?.length || 0} notifications found`);
      } else {
        setTestResult(`❌ API Test Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ API Test Error: ${error}`);
    }
  };

  const testBroadcastingAuth = async () => {
    try {
      const response = await fetch('/broadcasting/auth', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel_name: `private-notifications.${profile?.id}`,
          socket_id: 'test.123'
        })
      });
      
      if (response.ok) {
        setTestResult(`✅ Broadcasting Auth Success: ${response.status}`);
      } else {
        setTestResult(`❌ Broadcasting Auth Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Broadcasting Auth Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧪 Notification System Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">📡 Connection Status</h2>
          <div className="space-y-2">
            <div className={`p-2 rounded ${
              connectionState === 'connected' ? 'bg-green-100 text-green-800' :
              connectionState === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Status: {connectionState}
            </div>
            <div>User ID: {profile?.id || 'Not loaded'}</div>
            <div>Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}</div>
            <div>Notifications: {notifications.length}</div>
            <div>Unread: {unreadCount}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">🔧 Tests</h2>
          <div className="space-y-3">
            <button
              onClick={runConnectionTest}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Connection Test
            </button>
            
            <button
              onClick={testApiCall}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test API Call
            </button>
            
            <button
              onClick={testBroadcastingAuth}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test Broadcasting Auth
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white p-6 rounded-lg border md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">📋 Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {testResult || 'Click a test button to see results...'}
          </pre>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg border md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">📖 Instructions</h2>
          <div className="space-y-2 text-sm">
            <p><strong>1. Check Connection Status:</strong> Should show "connected" in green</p>
            <p><strong>2. Run Connection Test:</strong> All items should show ✅</p>
            <p><strong>3. Test API Call:</strong> Should return success with notification count</p>
            <p><strong>4. Test Broadcasting Auth:</strong> Should return 200 success</p>
            <p><strong>5. Send Test Notification:</strong> Use Laravel tinker to send a test notification</p>
          </div>
        </div>

        {/* Laravel Command */}
        <div className="bg-gray-50 p-6 rounded-lg border md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">🚀 Send Test Notification</h2>
          <p className="text-sm mb-2">Run this in your Laravel backend:</p>
          <pre className="bg-black text-green-400 p-4 rounded text-sm">
{`php artisan tinker

$user = User::find(${profile?.id || 'YOUR_USER_ID'});
$service = app(\\App\\Services\\InAppNotificationService::class);
$service->send($user, 'Test Notification', 'This should appear instantly!', 'test', 'bell', '/dashboard');`}
          </pre>
        </div>
      </div>
    </div>
  );
}