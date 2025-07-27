import React, { useState, useEffect, useRef } from "react";
import { VoiceService, VoiceServiceCallbacks } from "../services/voiceService";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { AvatarView } from "./AvatarView";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, RotateCcw, X } from "lucide-react";

interface VoiceChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState(
    "Click the microphone to start voice chat"
  );
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const voiceServiceRef = useRef<VoiceService | null>(null);

  // Initialize voice service
  useEffect(() => {
    if (isOpen && !voiceServiceRef.current) {
      const callbacks: VoiceServiceCallbacks = {
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
          if (newStatus.includes("Listening")) {
            setIsRecording(true);
          } else if (
            newStatus.includes("stopped") ||
            newStatus.includes("Error")
          ) {
            setIsRecording(false);
          }
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsRecording(false);
        },
        onAudioLevelChange: (level) => {
          setAudioLevel(level);
        },
      };

      try {
        voiceServiceRef.current = new VoiceService(callbacks);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize voice service"
        );
      }
    }

    return () => {
      if (!isOpen && voiceServiceRef.current) {
        voiceServiceRef.current.destroy();
        voiceServiceRef.current = null;
      }
    };
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.destroy();
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

  const handleClose = () => {
    handleStopVoiceChat();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/riya.png"
                  alt="Riya"
                  className="w-10 h-10 rounded-2xl border-2 border-primary shadow-md object-cover bg-white"
                />
                <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-400 border-2 border-card shadow"></span>
              </div>
              <div>
                <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                  Voice Chat with Riya
                </h3>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Ready for voice
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row h-[70vh]">
            {/* Avatar Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary-dark/5">
              <div className="relative">
                <AvatarView />
                {/* Voice Activity Indicator */}
                {isRecording && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <VoiceVisualizer
                      audioLevel={audioLevel}
                      isActive={isRecording}
                      className="w-16 h-16"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Controls Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 space-y-6">
              {/* Instructions */}
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl p-4 w-full max-w-sm"
                >
                  <h4 className="font-semibold text-primary mb-2">
                    How to use voice chat:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Click the microphone to start recording</li>
                    <li>• Speak naturally - Riya will respond with voice</li>
                    <li>• Click stop when you're done speaking</li>
                    <li>• Use reset to start a new conversation</li>
                  </ul>
                </motion.div>
              )}

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  disabled={isRecording}
                  className="p-3 rounded-xl bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>

                {/* Start/Stop Button */}
                {!isRecording ? (
                  <button
                    onClick={handleStartVoiceChat}
                    className="p-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Start voice chat"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                ) : (
                  <button
                    onClick={handleStopVoiceChat}
                    className="p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Stop recording"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                )}
              </div>

              {/* Status */}
              <div className="text-center w-full max-w-sm">
                <p className="text-sm font-medium text-foreground mb-1">
                  {status}
                </p>
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
