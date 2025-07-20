
import { create } from 'zustand';
import { Emotion } from '../types';

interface AvatarState {
  emotion: Emotion;
  setEmotion: (emotion: Emotion) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  emotion: 'neutral',
  setEmotion: (emotion) => set({ emotion }),
}));
