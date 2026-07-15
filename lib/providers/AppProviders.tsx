'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '@/lib/context/AuthContext';
import { NotificationProvider } from '@/lib/context/NotificationContext';
import { CartProvider } from '@/lib/context/CartContext';
import { ToastProvider } from '@/lib/components/ToastProvider';
import { ThemeProvider } from './ThemeProvider';

/**
 * App Providers Component
 * Combines all application providers in the correct order
 * 
 * Provider Hierarchy:
 * 1. QueryProvider - React Query for data fetching
 * 2. AuthProvider - Authentication state
 * 3. NotificationProvider - Notification management
 * 4. CartProvider - Shopping cart state
 * 5. ToastProvider - Toast notifications
 * 
 * @example
 * // In app/layout.tsx
 * <AppProviders>
 *   {children}
 * </AppProviders>
 */
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <ToastProvider />
              {children}
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};
