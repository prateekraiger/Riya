import { create } from "zustand";
import { Conversation } from "../types";

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversationId: (id: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  getCurrentConversation: () => Conversation | null;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
    })),

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      currentConversationId:
        state.currentConversationId === id ? null : state.currentConversationId,
    })),

  setCurrentConversationId: (id) => set({ currentConversationId: id }),

  setIsLoading: (isLoading) => set({ isLoading }),

  getCurrentConversation: () => {
    const { conversations, currentConversationId } = get();
    return (
      conversations.find((conv) => conv.id === currentConversationId) || null
    );
  },
}));
