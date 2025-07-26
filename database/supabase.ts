/// <reference types="vite/client" />
import { createClient, User } from "@supabase/supabase-js";
import type { Message, Conversation } from "../types";

// Export the Supabase User type for other parts of the app to use
export type { User };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Conversation Management
export const createConversation = async (
  userId: string,
  title?: string
): Promise<Conversation | null> => {
  try {
    // Validate userId is provided (Stack Auth handles authentication)
    if (!userId) {
      console.error("❌ User ID not provided");
      return null;
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: userId,
        title: title || "New Chat",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "42P01") {
        console.error(
          "❌ Conversations table does not exist! Please run the database setup script in your Supabase SQL editor."
        );
        alert(
          "Database setup required! Please run the database setup script in your Supabase SQL editor. Check the console for details."
        );
        return null;
      }
      if (error.code === "42501") {
        console.error(
          "❌ RLS Policy Error: Please run the Stack Auth compatible database setup script (database-setup-stack-auth.sql)"
        );
        return null;
      }
      if (error.code === "23503") {
        console.error(
          "❌ Foreign Key Error: Please run the Stack Auth compatible database setup script (database-setup-stack-auth.sql)"
        );
        return null;
      }
      console.error("Error creating conversation:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return null;
    }
    return data as Conversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
};

export const getConversations = async (
  userId: string
): Promise<Conversation[]> => {
  try {
    // First, get all conversations
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        console.error(
          "❌ Conversations table does not exist! Please run the database setup script in your Supabase SQL editor."
        );
        return [];
      }
      console.error("Error fetching conversations:", error);
      return [];
    }

    if (!conversations || conversations.length === 0) {
      return [];
    }

    // Get message counts and last messages for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Get message count
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id);

        // Get last message
        const { data: lastMessage } = await supabase
          .from("messages")
          .select("text")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...conv,
          message_count: count || 0,
          last_message: lastMessage?.text || "",
        };
      })
    );

    return conversationsWithDetails as Conversation[];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const updateConversationTitle = async (
  conversationId: string,
  title: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("conversations")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (error) {
      console.error("Error updating conversation title:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error updating conversation title:", error);
    return false;
  }
};

export const deleteConversation = async (
  conversationId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error("Error deleting conversation:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
};

// Message Management
export const getChatHistory = async (
  conversationId: string
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
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

export const saveChatMessage = async (
  message: Message,
  userId: string,
  conversationId: string
) => {
  try {
    const { error } = await supabase.from("messages").insert({
      id: message.id,
      conversation_id: conversationId,
      user_id: userId,
      sender: message.sender,
      text: message.text,
    });

    if (error) {
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

// Generate conversation title from first message
export const generateConversationTitle = (firstMessage: string): string => {
  const words = firstMessage.trim().split(" ");
  if (words.length <= 6) {
    return firstMessage.trim();
  }
  return words.slice(0, 6).join(" ") + "...";
};
