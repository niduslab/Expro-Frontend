import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo | null = null;

function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || '';
  }
  return '';
}

export const getEcho = (token?: string): Echo => {
  // Always create a new instance if token is provided (for token refresh)
  if (token && echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const authToken = token || getAuthToken();

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}/api/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    },
    // Custom authorizer to handle wrapped responses and better error handling
    authorizer: (channel: any, options: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          const currentToken = getAuthToken();
          
          fetch(options.authEndpoint, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${currentToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then(async (response) => {
              if (!response.ok) {
                const errorText = await response.text();
                console.error('Broadcasting auth failed:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              
              const text = await response.text();
              
              if (!text || text.length === 0) {
                console.error('Empty response from broadcasting auth endpoint');
                throw new Error('Empty response from broadcasting auth endpoint');
              }
              
              let data;
              try {
                data = JSON.parse(text);
              } catch (e) {
                console.error('Failed to parse broadcasting auth response:', text);
                throw new Error('Invalid JSON response from broadcasting auth endpoint');
              }
              
              return data;
            })
            .then((data) => {
              // Handle wrapped response (your API format)
              let authData = data;
              
              // If response is wrapped in 'data' key
              if (data.data && typeof data.data === 'object') {
                authData = data.data;
              }
              
              // If response has 'success' wrapper
              if (data.success && data.auth) {
                authData = { auth: data.auth };
              }
              
              // Ensure we have the auth key
              if (!authData.auth) {
                console.error('No auth key in broadcasting response:', data);
                throw new Error('Invalid auth response format - missing auth key');
              }
              
              callback(null, authData);
            })
            .catch((error) => {
              console.error('Broadcasting auth error:', error.message);
              callback(error, null);
            });
        },
      };
    },
  });

  // Add connection event listeners
  if (echoInstance.connector && echoInstance.connector.pusher) {
    echoInstance.connector.pusher.connection.bind('error', (error: any) => {
      console.error('Pusher connection error:', error);
    });
  }

  return echoInstance;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    console.log('🔌 Disconnecting Echo instance');
    echoInstance.disconnect();
    echoInstance = null;
  }
};

export const getConnectionState = () => {
  if (echoInstance && echoInstance.connector && echoInstance.connector.pusher) {
    return echoInstance.connector.pusher.connection.state;
  }
  return 'disconnected';
};
