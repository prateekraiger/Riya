import { useUser } from "@clerk/clerk-react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();

  // Add console log for debugging
  console.log("useAuth hook - User state:", {
    isAuthenticated: !!user,
    isLoaded,
    userId: user?.id,
  });

  return { user, loading: !isLoaded };
};
