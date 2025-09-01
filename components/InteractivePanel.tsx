import React, { useState, useEffect, useRef } from "react";
import { VoiceService, VoiceServiceCallbacks } from "../services/voiceService";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, RotateCcw, Square } from "lucide-react";

type InteractionMode = "chat" | "voice";

interface InteractivePanelProps {
  mode: InteractionMode;
  handleSendMessage: (text: string) => Promise<void>;
  onModeChange?: (mode: InteractionMode) => void;
  onConversationSelect?: (conversationId: string) => void;
}

export const InteractivePanel: React.FC<InteractivePanelProps> = ({
  mode,
  handleSendMessage,
  onModeChange,
  onConversationSelect,
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
    <div className="w-full h-full flex-1 flex flex-col min-h-0">
      {/* Mode Toggle Header */}
      <div className="flex items-center justify-between p-2 sm:p-3 border-b border-border/30 bg-gradient-to-r from-card/60 via-card/50 to-card/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleModeSwitch("chat")}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              mode === "chat"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            💬 Text
          </button>
          <button
            onClick={() => handleModeSwitch("voice")}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              mode === "voice"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            🎤 Voice
          </button>
        </div>

        {mode === "voice" && (
          <div className="flex items-center gap-1 sm:gap-2">
            <div
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
              }`}
            ></div>
            <span className="text-xs text-muted-foreground">
              {isRecording ? "Recording" : "Ready"}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
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
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 min-h-0">
                <MessageList
                  onSendMessage={handleSendMessage}
                  onConversationSelect={onConversationSelect}
                />
              </div>
              <div className="p-2 sm:p-3 border-t border-border/30 flex-shrink-0 bg-card/30 backdrop-blur-sm">
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
              <div className="flex-1 flex flex-col justify-center items-center p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
                {/* Instructions */}
                {showInstructions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/10 border border-primary/20 rounded-2xl p-3 sm:p-4 w-full max-w-sm sm:max-w-md"
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
                    className="w-24 h-24 sm:w-32 sm:h-32"
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
                      <Square className="w-8 h-8" />
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
              <div className="border-t border-border bg-card/30 p-2 sm:p-3 flex-shrink-0">
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
    </div>
  );
};
