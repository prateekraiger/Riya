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
