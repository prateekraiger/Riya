import { useState, useEffect } from "react";
import { supabase, onAuthStateChange, type User } from "../supabase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }

        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Set a timeout as a fallback in case Supabase takes too long
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 5000); // 5-second timeout

    const subscription = onAuthStateChange((currentUser) => {
      if (isMounted) {
        clearTimeout(timeoutId); // Clear the timeout if we get a response
        setUser(currentUser);
        setLoading(false);

        // Store user info in localStorage for additional persistence
        if (currentUser) {
          localStorage.setItem("riya_user_id", currentUser.id);
          localStorage.setItem("riya_user_email", currentUser.email || "");
        } else {
          localStorage.removeItem("riya_user_id");
          localStorage.removeItem("riya_user_email");
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
};
