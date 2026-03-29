/**
 * Authentication Hooks
 * Handles login, logout, and user session management
 */

import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { publicApiRequest, apiRequest, authUtils } from '@/lib/api/axios';
import { useAuth as useAuthContext } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

/**
 * User Interface
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'chairman';
  status: string;
  phone?: string;
  address?: string;
}

/**
 * Login Request/Response Types
 */
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

/**
 * Get CSRF Cookie from Laravel Sanctum
 */
async function getCsrfCookie(): Promise<void> {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
    // Remove /api/v1 from the end to get the base URL
    const baseURL = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
    const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;
    
    console.log('Fetching CSRF token from:', csrfUrl); // Debug log
    
    await axios.get(csrfUrl, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to fetch CSRF cookie:', error);
    throw error;
  }
}

/**
 * Hook: Login Mutation
 * Handles user login with backend API
 * 
 * @returns Mutation object with login function
 * 
 * @example
 * const { mutate: login, isPending, error } = useLogin();
 * 
 * const handleLogin = () => {
 *   login({ email: 'user@example.com', password: 'password' });
 * };
 */
export const useLogin = () => {
  const { login: setAuthUser } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      try {
        // Step 1: Get CSRF cookie (required for Laravel Sanctum)
        await getCsrfCookie();

        // Step 2: Login with credentials using publicApiRequest (same as contact form)
        const response = await publicApiRequest.post('/login', credentials);
        
        console.log('Login response:', response.data); // Debug log
        
        // Check if response is successful
        if (response.data.success) {
          return response.data;
        } else {
          throw new Error(response.data.message || 'Login failed');
        }
      } catch (error: any) {
        // Handle errors similar to contact form
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        } else if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
          throw new Error(errorMessages);
        } else if (error.message) {
          throw error;
        } else {
          throw new Error('Login failed. Please check your credentials and try again.');
        }
      }
    },
    onSuccess: (data: any) => {
      console.log('Login data:', data); // Debug log
      
      // Backend returns: { success, message, token, user }
      // The user and token are at the root level, not nested in data.data
      const { user, token } = data;

      if (!user || !token) {
        console.error('Missing user or token in response:', data);
        throw new Error('Invalid response from server');
      }

      // Extract role from roles array if it exists
      const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'user';

      // Create user object with proper structure
      const userData = {
        id: user.id,
        name: user.name || user.email.split('@')[0], // Fallback to email username if name not provided
        email: user.email,
        role: userRole as 'user' | 'admin' | 'chairman',
        status: user.status,
        phone: user.phone,
        address: user.address,
      };

      // Store token in localStorage
      authUtils.setToken(token);

      // Update auth context
      setAuthUser(token, userData);

      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();

      // Redirect based on role
      if (userRole === 'admin' || userRole === 'chairman') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      // Error will be handled by the component
    },
  });
};

/**
 * Hook: Logout Mutation
 * Handles user logout
 * 
 * @returns Mutation object with logout function
 * 
 * @example
 * const { mutate: logout } = useLogout();
 * 
 * const handleLogout = () => {
 *   logout();
 * };
 */
export const useLogout = () => {
  const { logout: clearAuthUser } = useAuthContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        // Use apiRequest for authenticated endpoints
        await apiRequest.post('/logout');
      } catch (error) {
        // Continue with logout even if API call fails
        console.error('Logout API error:', error);
      }
    },
    onSuccess: () => {
      // Clear token
      authUtils.removeToken();

      // Clear auth context
      clearAuthUser();

      // Clear all cached queries
      queryClient.clear();

      // Redirect to login
      router.push('/login');
    },
  });
};

/**
 * Hook: Get Current User Profile
 * Fetches the authenticated user's profile
 * 
 * @returns Query object with user data
 * 
 * @example
 * const { data: user, isLoading, error } = useCurrentUser();
 */
export const useCurrentUser = () => {
  const { updateUser } = useAuthContext();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      try {
        // Use apiRequest for authenticated endpoints
        const response = await apiRequest.get('/myprofile');
        
        if (response.data.success && response.data.data) {
          return response.data.data;
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },
    enabled: !!authUtils.getToken(), // Only fetch if token exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Update auth context when user data changes
  React.useEffect(() => {
    if (query.data) {
      updateUser(query.data);
    }
  }, [query.data, updateUser]);

  return query;
};

/**
 * Hook: Check Authentication Status
 * Returns authentication status and user data
 * 
 * @returns Authentication state
 * 
 * @example
 * const { isAuthenticated, user, isLoading } = useAuthStatus();
 */
export const useAuthStatus = () => {
  const authContext = useAuthContext();
  const { data: user, isLoading } = useCurrentUser();

  return {
    isAuthenticated: authContext.isAuthenticated || !!authUtils.getToken(),
    user: user || authContext.user,
    isLoading: isLoading || authContext.isLoading,
  };
};
