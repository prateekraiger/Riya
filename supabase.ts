import { createClient, User } from "@supabase/supabase-js";
import type { Message } from "./types";

// Export the Supabase User type for other parts of the app to use
export type { User };

const supabaseUrl = "https://xxasnwtheyikynyzffhu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4YXNud3RoZXlpa3lueXpmZmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODE2MTUsImV4cCI6MjA2ODU1NzYxNX0.vQXJXaJHnjmKekH1OEu9PE25_BnZcZ_KFQZ5wUyy2nQ";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// --- Authentication Functions ---
export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password });
export const signInWithPassword = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });
export const signOut = async () => {
  // Clear localStorage items
  localStorage.removeItem("riya_user_id");
  localStorage.removeItem("riya_user_email");

  // Sign out from Supabase
  return supabase.auth.signOut();
};
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return subscription;
};

// --- Database Functions ---
/**
 * NOTE: For chat history to work, you must create a `messages` table in your Supabase project with the following columns:
 * - id: uuid (Primary Key)
 * - user_id: uuid (Foreign Key to auth.users.id)
 * - created_at: timestamptz
 * - sender: text ('user' or 'ai')
 * - text: text
 *
 * You must also enable Row Level Security (RLS) on the table and create policies
 * that allow authenticated users to read and write their own messages.
 */
export const getChatHistory = async (userId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      // If table doesn't exist, return empty array instead of throwing error
      if (error.code === "42P01") {
        console.warn(
          "Messages table does not exist. Please run the database setup script."
        );
        return [];
      }
      console.error("Error fetching chat history:", error);
      return [];
    }
    return data as Message[];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
};

export const saveChatMessage = async (message: Message, userId: string) => {
  try {
    const { error } = await supabase.from("messages").insert({
      id: message.id,
      user_id: userId,
      sender: message.sender,
      text: message.text,
    });

    if (error) {
      // If table doesn't exist, just log a warning instead of throwing error
      if (error.code === "42P01") {
        console.warn(
          "Messages table does not exist. Please run the database setup script."
        );
        return;
      }
      console.error("Error saving chat message:", error);
    }
  } catch (error) {
    console.error("Error saving chat message:", error);
  }
};
