import React, { useEffect } from 'react';
import { useLocation as useWouterLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';

export function MainRouter({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useWouterLocation();
  const { data: user, isLoading } = useAuth();

  useEffect(() => {
    // Skip redirect if loading
    if (isLoading) return;

    // Get current path
    const currentPath = window.location.pathname;

    // Skip if already on a dashboard or auth page
    if (
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/login') ||
      currentPath.startsWith('/register') ||
      currentPath === '/' ||
      currentPath.startsWith('/intro')
    ) {
      return;
    }

    // Auto-redirect based on role
    if (user) {
      if (user.role === 'coach') {
        setLocation('/dashboard/coach');
      } else if (user.role === 'client' || user.isClient) {
        setLocation('/dashboard/client');
      } else {
        setLocation('/dashboard/athlete');
      }
    }
  }, [user, isLoading, setLocation]);

  return <>{children}</>;
}
