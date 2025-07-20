import { useState, useEffect } from 'react';
import { onAuthStateChange, type User } from '../supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout as a fallback in case Supabase takes too long
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 3000); // 3-second timeout

    const subscription = onAuthStateChange((currentUser) => {
      if (isMounted) {
        clearTimeout(timeoutId); // Clear the timeout if we get a response
        setUser(currentUser);
        setLoading(false);
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
