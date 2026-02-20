// Mock authentication utilities

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Helper to check if code is running on server or client
export const isServer = typeof window === 'undefined';

// Mock function to simulate login
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  if (email === 'admin@example.com' && password === 'admin') {
    return {
      user: { id: '1', name: 'Admin User', email, role: 'admin' },
      token: 'mock-admin-token',
    };
  }
  
  if (email === 'user@example.com' && password === 'user') {
    return {
      user: { id: '2', name: 'Regular User', email, role: 'user' },
      token: 'mock-user-token',
    };
  }
  
  throw new Error('Invalid credentials');
}

// Mock function to simulate logout
export async function logout() {
  // Clear cookies/tokens
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Helper to get auth token from cookies (client-side)
export function getAuthToken(): string | null {
  if (isServer) return null;
  const match = document.cookie.match(new RegExp('(^| )auth-token=([^;]+)'));
  if (match) return match[2];
  return null;
}
