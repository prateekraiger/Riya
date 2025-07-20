
import { create } from 'zustand';

interface VoiceState {
  isListening: boolean;
  transcript: string;
  setIsListening: (isListening: boolean) => void;
  setTranscript: (transcript: string) => void;
  resetTranscript: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  transcript: '',
  setIsListening: (isListening) => set({ isListening }),
  setTranscript: (transcript) => set({ transcript }),
  resetTranscript: () => set({ transcript: '' }),
}));
