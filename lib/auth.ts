import axios from 'axios';
import { apiClient } from '@/app/tanstack/api/BaseApi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Helper to check if code is running on server or client
export const isServer = typeof window === 'undefined';

// Get CSRF cookie from Laravel Sanctum
async function getCsrfCookie(): Promise<void> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '');
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

// Real login function that connects to Laravel backend
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    // Step 1: Get CSRF cookie first (required for Laravel Sanctum)
    await getCsrfCookie();
    
    // Step 2: Login with credentials
    const response = await apiClient.post('/public/login', {
      email,
      password,
    });
    
    // Laravel will set HTTP-only cookies automatically
    // Return user data and token (if provided)
    return {
      user: response.data.user,
      token: response.data.token || '',
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please check your credentials.');
  }
}

// Logout function
export async function logout() {
  try {
    await apiClient.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Get current user profile
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get('/myprofile');
    return response.data;
  } catch (error) {
    return null;
  }
}
