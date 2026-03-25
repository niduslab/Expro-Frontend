'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';

/**
 * Authentication Guard Component
 * Protects routes that require authentication
 * 
 * @param children - Child components to render if authenticated
 * @param requiredRole - Optional role requirement
 * 
 * @example
 * <AuthGuard requiredRole="admin">
 *   <AdminDashboard />
 * </AuthGuard>
 */
interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'chairman';
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};
