import { useUser } from "@stackframe/react";

export const useAuth = () => {
  const user = useUser();

  // Add console log for debugging
  console.log("useAuth hook - User state:", {
    isAuthenticated: !!user,
    userId: user?.id,
  });

  return { user, loading: false };
};
