export enum Sender {
  User = "user",
  AI = "ai",
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string; // 'heart', 'laugh', 'sad', 'angry', 'surprised'
  created_at: string;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  created_at?: string;
  reactions?: MessageReaction[];
  emotion_detected?: string;
  is_favorite?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  message_count?: number;
  last_message?: string;
}

export type Emotion =
  | "neutral"
  | "happy"
  | "sad"
  | "angry"
  | "surprised"
  | "thinking";

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