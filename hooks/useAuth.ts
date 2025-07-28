import { useUser } from "@stackframe/react";

export const useAuth = () => {
  const user = useUser();

  // User authentication state

  return { user, loading: false };
};
