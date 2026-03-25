'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authUtils } from '@/lib/api/axios';

/**
 * Authentication Context Types
 */
interface User {
  id: number;
  email: string;
  role: 'user' | 'admin' | 'chairman';
  status: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Manages global authentication state
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const token = authUtils.getToken();
    if (token) {
      // Fetch user data or validate token
      // For now, just set authenticated state
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, userData: User) => {
    authUtils.setToken(token);
    setUser(userData);
  };

  const logout = () => {
    authUtils.removeToken();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook: Use Authentication Context
 * Access authentication state and methods
 * 
 * @returns Authentication context
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
