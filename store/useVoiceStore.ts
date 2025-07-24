import { create } from "zustand";

interface VoiceState {
  isListening: boolean;
  transcript: string;
  isVoiceModeActive: boolean;
  audioLevel: number;
  setIsListening: (isListening: boolean) => void;
  setTranscript: (transcript: string) => void;
  setIsVoiceModeActive: (isActive: boolean) => void;
  setAudioLevel: (level: number) => void;
  resetTranscript: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  transcript: "",
  isVoiceModeActive: false,
  audioLevel: 0,
  setIsListening: (isListening) => set({ isListening }),
  setTranscript: (transcript) => set({ transcript }),
  setIsVoiceModeActive: (isActive) => set({ isVoiceModeActive: isActive }),
  setAudioLevel: (level) => set({ audioLevel: level }),
  resetTranscript: () => set({ transcript: "" }),
}));
