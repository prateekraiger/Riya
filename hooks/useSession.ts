import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export const useSession = () => {
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    // Check if we have a valid session on app start
    const checkInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsSessionLoaded(true);

        if (session) {
          console.log("Session restored from localStorage");
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        setIsSessionLoaded(true);
      }
    };

    checkInitialSession();
  }, []);

  return { isSessionLoaded };
};
