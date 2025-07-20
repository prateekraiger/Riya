
import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setLastMessageContent: (content: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [], isLoading: false }),
  setLastMessageContent: (content) =>
    set((state) => {
      if (state.messages.length === 0) return {};
      // Correctly perform an immutable update
      const newMessages = state.messages.map((msg, index) => {
        if (index === state.messages.length - 1) {
          return { ...msg, text: content };
        }
        return msg;
      });
      return { messages: newMessages };
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
