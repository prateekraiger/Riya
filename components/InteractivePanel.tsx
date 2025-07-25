import React, { useState, useEffect, useRef } from "react";
import { VoiceService, VoiceServiceCallbacks } from "../services/voiceService";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";

type InteractionMode = "chat" | "voice";

interface InteractivePanelProps {
  mode: InteractionMode;
  handleSendMessage: (text: string) => Promise<void>;
  onModeChange?: (mode: InteractionMode) => void;
}

export const InteractivePanel: React.FC<InteractivePanelProps> = ({
  mode,
  handleSendMessage,
  onModeChange,
}) => {
  // Voice chat state
  const [status, setStatus] = useState(
    "Click the microphone to start voice chat"
  );
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const voiceServiceRef = useRef<VoiceService | null>(null);

  // Initialize voice service when in voice mode
  useEffect(() => {
    if (mode === "voice" && !voiceServiceRef.current) {
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
      if (mode !== "voice" && voiceServiceRef.current) {
        voiceServiceRef.current.destroy();
        voiceServiceRef.current = null;
      }
    };
  }, [mode]);

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

  const handleModeSwitch = (newMode: InteractionMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col">
      {/* Mode Toggle Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleModeSwitch("chat")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "chat"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            💬 Text Chat
          </button>
          <button
            onClick={() => handleModeSwitch("voice")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "voice"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            🎤 Voice Chat
          </button>
        </div>

        {mode === "voice" && (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
              }`}
            ></div>
            <span className="text-xs text-muted-foreground">
              {isRecording ? "Recordin." : "Ready"}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {mode === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
              <MessageList onSendMessage={handleSendMessage} />
            </div>
            <div className="p-4 md:p-6 border-t border-border flex-shrink-0">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </motion.div>
        )}

        {mode === "voice" && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            {/* Voice Chat Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-6">
              {/* Instructions */}
              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl p-4 w-full max-w-md"
                >
                  <h4 className="font-semibold text-primary mb-2">
                    🎙️ Voice Chat Instructions:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Click the microphone to start recording</li>
                    <li>• Speak naturally - Riya will respond with voice</li>
                    <li>• Click stop when you're done speaking</li>
                    <li>• Use reset to start a new conversation</li>
                  </ul>
                </motion.div>
              )}

              {/* Voice Visualizer */}
              <div className="relative">
                <VoiceVisualizer
                  audioLevel={audioLevel}
                  isActive={isRecording}
                  className="w-24 h-24"
                />
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping"></div>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex justify-center gap-4">
                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  disabled={isRecording}
                  className="p-3 rounded-xl bg-secondary/60 hover:bg-secondary/80 text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  title="Reset conversation"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>

                {/* Start/Stop Button */}
                {!isRecording ? (
                  <button
                    onClick={handleStartVoiceChat}
                    className="p-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Start voice chat"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleStopVoiceChat}
                    className="p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Stop recording"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Status Display */}
              <div className="text-center w-full max-w-md">
                <p className="text-sm font-medium text-foreground mb-1">
                  {status}
                </p>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Voice Chat History (Optional) */}
            <div className="border-t border-border bg-card/30 p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Voice conversations are processed in real-time
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
