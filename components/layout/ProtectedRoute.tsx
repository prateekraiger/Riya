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
  console.log("ProtectedRoute check - User authenticated:", !!user);

  if (!user) {
    console.log("User not authenticated, redirecting to login page");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};
