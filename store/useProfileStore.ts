import { create } from "zustand";
import { UserProfile, MoodEntry, UserMemory } from "../database/supabase";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  moodHistory: MoodEntry[];
  memories: UserMemory[];

  // Profile actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setIsLoading: (loading: boolean) => void;

  // Mood actions
  setMoodHistory: (moods: MoodEntry[]) => void;
  addMoodEntry: (mood: MoodEntry) => void;

  // Memory actions
  setMemories: (memories: UserMemory[]) => void;
  addMemory: (memory: UserMemory) => void;

  // Utility actions
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  moodHistory: [],
  memories: [],

  setProfile: (profile) => set({ profile }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setMoodHistory: (moodHistory) => set({ moodHistory }),

  addMoodEntry: (mood) =>
    set((state) => ({
      moodHistory: [mood, ...state.moodHistory],
    })),

  setMemories: (memories) => set({ memories }),

  addMemory: (memory) =>
    set((state) => ({
      memories: [memory, ...state.memories],
    })),

  clearProfile: () =>
    set({
      profile: null,
      moodHistory: [],
      memories: [],
      isLoading: false,
    }),
}));
