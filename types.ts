export enum Sender {
  User = "user",
  AI = "ai",
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  created_at?: string;
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
