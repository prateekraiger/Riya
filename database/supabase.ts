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
      return null;
    }
    return data as Conversation;
  } catch (error) {
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
      return false;
    }
    return true;
  } catch (error) {
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
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

// Message Management
export const getChatHistory = async (
  conversationId: string,
  limit?: number,
  offset?: number
): Promise<Message[]> => {
  try {
    let query = supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false }); // Most recent first for pagination

    if (limit) {
      query = query.limit(limit);
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return [];
    }

    // Reverse to show oldest first in UI
    return (data as Message[]).reverse();
  } catch (error) {
    return [];
  }
};

// Get recent messages (for initial load)
export const getRecentMessages = async (
  conversationId: string,
  limit: number = 50
): Promise<Message[]> => {
  return getChatHistory(conversationId, limit, 0);
};

// Get older messages (for infinite scroll)
export const getOlderMessages = async (
  conversationId: string,
  beforeMessageId: string,
  limit: number = 50
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .lt(
        "created_at",
        (
          await supabase
            .from("messages")
            .select("created_at")
            .eq("id", beforeMessageId)
            .single()
        ).data?.created_at || new Date().toISOString()
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching older messages:", error);
      return [];
    }

    return (data as Message[]).reverse();
  } catch (error) {
    console.error("Error fetching older messages:", error);
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

// =====================================================
// USER PROFILE FUNCTIONS
// =====================================================

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  age?: string;
  bio?: string;
  profile_picture_url?: string;
  interests: string[];
  relationship_goals: string;
  communication_style: string;
  favorite_topics: string[];
  riya_personality: string;
  voice_preference: string;
  timezone?: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  preference_key: string;
  preference_value: any;
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  mood_tags: string[];
  notes?: string;
  created_at: string;
}

export interface UserMemory {
  id: string;
  user_id: string;
  conversation_id?: string;
  memory_type: string;
  memory_key: string;
  memory_value: string;
  importance_score: number;
  created_at: string;
  updated_at: string;
}

// User Profile Management
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found, return null
        return null;
      }
      console.error("Error fetching user profile:", error);
      return null;
    }
    return data as UserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const createUserProfile = async (
  profile: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: profile.user_id,
        display_name: profile.display_name || "",
        age: profile.age || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
        relationship_goals: profile.relationship_goals || "companionship",
        communication_style: profile.communication_style || "casual",
        favorite_topics: profile.favorite_topics || [],
        riya_personality: profile.riya_personality || "caring",
        voice_preference: profile.voice_preference || "soft",
        timezone: profile.timezone || "",
        language_preference: profile.language_preference || "en",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
    return data as UserProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
    return data as UserProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};

// User Preferences Management
export const getUserPreference = async (
  userId: string,
  key: string
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("preference_value")
      .eq("user_id", userId)
      .eq("preference_key", key)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No preference found
      }
      console.error("Error fetching user preference:", error);
      return null;
    }
    return data.preference_value;
  } catch (error) {
    console.error("Error fetching user preference:", error);
    return null;
  }
};

export const setUserPreference = async (
  userId: string,
  key: string,
  value: any
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("user_preferences").upsert({
      user_id: userId,
      preference_key: key,
      preference_value: value,
    });

    if (error) {
      console.error("Error setting user preference:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error setting user preference:", error);
    return false;
  }
};

// Mood Tracking
export const addMoodEntry = async (
  userId: string,
  moodScore: number,
  moodTags: string[],
  notes?: string
): Promise<MoodEntry | null> => {
  try {
    const { data, error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: userId,
        mood_score: moodScore,
        mood_tags: moodTags,
        notes: notes || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding mood entry:", error);
      return null;
    }
    return data as MoodEntry;
  } catch (error) {
    console.error("Error adding mood entry:", error);
    return null;
  }
};

export const getMoodHistory = async (
  userId: string,
  limit: number = 30
): Promise<MoodEntry[]> => {
  try {
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching mood history:", error);
      return [];
    }
    return data as MoodEntry[];
  } catch (error) {
    console.error("Error fetching mood history:", error);
    return [];
  }
};

// Memory System
export const addUserMemory = async (
  memory: Partial<UserMemory>
): Promise<UserMemory | null> => {
  try {
    const { data, error } = await supabase
      .from("user_memories")
      .insert({
        user_id: memory.user_id,
        conversation_id: memory.conversation_id,
        memory_type: memory.memory_type,
        memory_key: memory.memory_key,
        memory_value: memory.memory_value,
        importance_score: memory.importance_score || 5,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding user memory:", error);
      return null;
    }
    return data as UserMemory;
  } catch (error) {
    console.error("Error adding user memory:", error);
    return null;
  }
};

export const getUserMemories = async (
  userId: string,
  memoryType?: string
): Promise<UserMemory[]> => {
  try {
    let query = supabase
      .from("user_memories")
      .select("*")
      .eq("user_id", userId)
      .order("importance_score", { ascending: false })
      .order("updated_at", { ascending: false });

    if (memoryType) {
      query = query.eq("memory_type", memoryType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching user memories:", error);
      return [];
    }
    return data as UserMemory[];
  } catch (error) {
    console.error("Error fetching user memories:", error);
    return [];
  }
};

// =====================================================
// MESSAGE REACTIONS FUNCTIONS
// =====================================================

export const addMessageReaction = async (
  messageId: string,
  userId: string,
  reactionType: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("message_reactions").insert({
      message_id: messageId,
      user_id: userId,
      reaction_type: reactionType,
    });

    if (error) {
      console.error("Error adding message reaction:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error adding message reaction:", error);
    return false;
  }
};

export const removeMessageReaction = async (
  messageId: string,
  userId: string,
  reactionType: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("message_reactions")
      .delete()
      .eq("message_id", messageId)
      .eq("user_id", userId)
      .eq("reaction_type", reactionType);

    if (error) {
      console.error("Error removing message reaction:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error removing message reaction:", error);
    return false;
  }
};

export const getMessageReactions = async (
  messageId: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("message_reactions")
      .select("*")
      .eq("message_id", messageId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching message reactions:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching message reactions:", error);
    return [];
  }
};

// Message Search
export const searchMessages = async (
  userId: string,
  query: string,
  limit: number = 50
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        conversations!inner(user_id)
      `
      )
      .eq("conversations.user_id", userId)
      .textSearch("text", query)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error searching messages:", error);
      return [];
    }
    return data as Message[];
  } catch (error) {
    console.error("Error searching messages:", error);
    return [];
  }
};

// Toggle message favorite
export const toggleMessageFavorite = async (
  messageId: string,
  isFavorite: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ is_favorite: isFavorite })
      .eq("id", messageId);

    if (error) {
      console.error("Error toggling message favorite:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error toggling message favorite:", error);
    return false;
  }
};
