import { useUser } from "@clerk/clerk-react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  return { user, loading: !isLoaded };
};
