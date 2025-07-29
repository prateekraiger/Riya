import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  user: any;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  children,
}) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
