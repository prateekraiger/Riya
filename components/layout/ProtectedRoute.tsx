import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../../supabase';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};