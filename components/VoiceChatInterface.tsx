import React, { useState, useEffect, useRef } from "react";
import { VoiceService, VoiceServiceCallbacks } from "../services/voiceService";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Mic } from "lucide-react";

export const VoiceChatInterface: React.FC = () => {
  const [status, setStatus] = useState(
    "Click the microphone to start voice chat"
  );
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const voiceServiceRef = useRef<VoiceService | null>(null);

  // Initialize voice service
  useEffect(() => {
    let mounted = true;

    const initializeVoiceService = async () => {
      if (!voiceServiceRef.current && mounted) {
        const callbacks: VoiceServiceCallbacks = {
          onStatusChange: (newStatus) => {
            if (mounted) {
              setStatus(newStatus);
              if (newStatus.includes("Listening")) {
                setIsRecording(true);
              } else if (
                newStatus.includes("stopped") ||
                newStatus.includes("Error")
              ) {
                setIsRecording(false);
              }
            }
          },
          onError: (errorMessage) => {
            if (mounted) {
              setError(errorMessage);
              setIsRecording(false);
            }
          },
          onAudioLevelChange: (level) => {
            if (mounted) {
              setAudioLevel(level);
            }
          },
        };

        try {
          voiceServiceRef.current = new VoiceService(callbacks);
          if (mounted) {
            setIsInitialized(true);
          }
        } catch (err) {
          if (mounted) {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to initialize voice service"
            );
          }
        }
      }
    };

    initializeVoiceService();

    return () => {
      mounted = false;
      if (voiceServiceRef.current) {
        voiceServiceRef.current.destroy();
        voiceServiceRef.current = null;
      }
    };
  }, []);

  const handleStartVoiceChat = async () => {
    if (!voiceServiceRef.current) return;

    setError("");
    setShowInstructions(false);

    try {
      await voiceServiceRef.current.startVoiceChat();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start voice chat"
      );
    }
  };

  const handleStopVoiceChat = () => {
    if (!voiceServiceRef.current) return;

    voiceServiceRef.current.stopVoiceChat();
    setIsRecording(false);
    setAudioLevel(0);
  };

  const handleReset = () => {
    if (!voiceServiceRef.current) return;

    voiceServiceRef.current.reset();
    setIsRecording(false);
    setAudioLevel(0);
    setError("");
    setShowInstructions(true);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            Initializing voice chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Instructions */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-6"
          >
            <h3 className="font-semibold text-primary mb-3 text-lg">
              Voice Chat with Riya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Click the microphone to start recording your voice</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Speak naturally - Riya will respond with voice</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Click stop when you're done speaking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>Use reset to start a new conversation</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Visualizer */}
      <div className="flex justify-center">
        <VoiceVisualizer
          audioLevel={audioLevel}
          isActive={isRecording}
          className="w-32 h-32"
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-6">
        {/* Reset Button */}
        <motion.button
          onClick={handleReset}
          disabled={isRecording}
          className="p-4 rounded-xl bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset conversation"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>

        {/* Start/Stop Button */}
        {!isRecording ? (
          <motion.button
            onClick={handleStartVoiceChat}
            className="p-6 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Start voice chat"
          >
            <Mic className="w-8 h-8" />
          </motion.button>
        ) : (
          <motion.button
            onClick={handleStopVoiceChat}
            className="p-6 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Stop recording"
          >
            <Mic className="w-8 h-8" />
          </motion.button>
        )}
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">{status}</p>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-[55]"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Recording...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
