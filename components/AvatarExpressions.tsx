import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAvatarStore } from "../store/useAvatarStore";
import { Mic, MessageCircle } from "lucide-react";

interface AvatarExpressionsProps {
  mode?: "chat" | "voice";
  onModeChange?: (mode: "chat" | "voice") => void;
  currentEmotion?: string;
  isListening?: boolean;
  isSpeaking?: boolean;
}

const avatarExpressions = {
  neutral: {
    image: "/assets/riya.png",
    description: "Neutral expression",
  },
  happy: {
    image: "/assets/riya-happy.png",
    description: "Happy and smiling",
  },
  thinking: {
    image: "/assets/riya-thinking.png",
    description: "Thinking and processing",
  },
  caring: {
    image: "/assets/riya-caring.png",
    description: "Caring and empathetic",
  },
  excited: {
    image: "/assets/riya-excited.png",
    description: "Excited and energetic",
  },
  sad: {
    image: "/assets/riya-sad.png",
    description: "Sad and understanding",
  },
  surprised: {
    image: "/assets/riya-surprised.png",
    description: "Surprised and curious",
  },
  listening: {
    image: "/assets/riya-listening.png",
    description: "Actively listening",
  },
  speaking: {
    image: "/assets/riya-speaking.png",
    description: "Speaking and animated",
  },
};

export const AvatarExpressions: React.FC<AvatarExpressionsProps> = ({
  mode = "chat",
  onModeChange,
  currentEmotion = "neutral",
  isListening = false,
  isSpeaking = false,
}) => {
  const { emotion } = useAvatarStore();
  const [currentExpression, setCurrentExpression] = useState("neutral");
  const [isBlinking, setIsBlinking] = useState(false);

  // Determine which expression to show
  useEffect(() => {
    if (isSpeaking) {
      setCurrentExpression("speaking");
    } else if (isListening) {
      setCurrentExpression("listening");
    } else if (
      emotion &&
      avatarExpressions[emotion as keyof typeof avatarExpressions]
    ) {
      setCurrentExpression(emotion);
    } else if (
      currentEmotion &&
      avatarExpressions[currentEmotion as keyof typeof avatarExpressions]
    ) {
      setCurrentExpression(currentEmotion);
    } else {
      setCurrentExpression("neutral");
    }
  }, [emotion, currentEmotion, isListening, isSpeaking]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isListening && !isSpeaking) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds

    return () => clearInterval(blinkInterval);
  }, [isListening, isSpeaking]);

  const getCurrentImage = () => {
    return (
      avatarExpressions[currentExpression as keyof typeof avatarExpressions]
        ?.image || avatarExpressions.neutral.image
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-0 sm:p-8 relative">
      {/* Mode Toggle Above Image - Desktop */}
      {onModeChange && (
        <div className="hidden sm:flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-primary/20">
            <button
              onClick={() => onModeChange("chat")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                mode === "chat"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to text chat"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => onModeChange("voice")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                mode === "voice"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to voice chat"
            >
              <Mic className="w-5 h-5" />
              <span>Voice</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Toggle Above Image - Mobile */}
      {onModeChange && (
        <div className="flex sm:hidden items-center justify-center mb-6">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-primary/20">
            <button
              onClick={() => onModeChange("chat")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                mode === "chat"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to text chat"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => onModeChange("voice")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                mode === "voice"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to voice chat"
            >
              <Mic className="w-4 h-4" />
              <span>Voice</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop & Tablet Layout */}
      <div className="hidden sm:block w-full">
        <div className="relative w-[360px] md:w-[420px] lg:w-[500px] aspect-[3/4] mx-auto">
          {/* Soft Glow */}
          <div className="absolute inset-0 bg-pink-400/20 rounded-3xl blur-3xl scale-110"></div>

          {/* Radial Pink Glow */}
          <div
            className="absolute inset-0 rounded-[2rem] blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 93, 143, 0.3) 0%, rgba(255, 93, 143, 0.1) 50%, transparent 70%)",
            }}
          ></div>

          {/* Extra Glow for Desktop */}
          <div
            className="absolute inset-0 rounded-[2rem] blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 93, 143, 0.22) 0%, rgba(255, 93, 143, 0.08) 55%, transparent 80%)",
            }}
          ></div>

          {/* Main Frame */}
          <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden">
            {/* Image Area */}
            <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-pink-50/30 relative">
              <div
                className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
                style={{
                  boxShadow: "0 0 60px 20px #FF5D8F, 0 0 120px 40px #FF5D8F",
                }}
              ></div>

              {/* Avatar Image with Expression */}
              <div className="relative z-20">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentExpression}
                    src={getCurrentImage()}
                    alt={`Riya - ${
                      avatarExpressions[
                        currentExpression as keyof typeof avatarExpressions
                      ]?.description
                    }`}
                    className="w-full h-full object-cover rounded-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: isBlinking ? 0.7 : 1,
                      scale: 1,
                      y: isSpeaking ? [-2, 2, -2] : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      y: { repeat: isSpeaking ? Infinity : 0, duration: 0.5 },
                    }}
                  />
                </AnimatePresence>

                {/* Voice Activity Indicator */}
                {isListening && (
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-green-500/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Listening...
                      </span>
                    </div>
                  </motion.div>
                )}

                {isSpeaking && (
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/30">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-3 bg-primary rounded-full"
                            animate={{ scaleY: [1, 2, 1] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-primary font-medium ml-1">
                        Speaking...
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden w-full">
        <div className="relative w-[90vw] max-w-[340px] aspect-[3/4] mx-auto">
          {/* Soft Glow */}
          <div className="absolute inset-0 bg-pink-400/20 rounded-3xl blur-2xl scale-110"></div>

          {/* Radial Pink Glow */}
          <div
            className="absolute inset-0 rounded-[2rem] blur-xl opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 93, 143, 0.25) 0%, rgba(255, 93, 143, 0.08) 55%, transparent 80%)",
            }}
          ></div>

          {/* Main Frame */}
          <div className="relative w-full h-full bg-white rounded-3xl shadow-xl border-2 border-white overflow-hidden">
            {/* Image Area */}
            <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-slate-50 to-pink-50/30 relative">
              <div
                className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
                style={{
                  boxShadow: "0 0 40px 12px #FF5D8F, 0 0 80px 24px #FF5D8F",
                }}
              ></div>

              {/* Avatar Image with Expression */}
              <div className="relative z-20">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentExpression}
                    src={getCurrentImage()}
                    alt={`Riya - ${
                      avatarExpressions[
                        currentExpression as keyof typeof avatarExpressions
                      ]?.description
                    }`}
                    className="w-full h-full object-cover rounded-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: isBlinking ? 0.7 : 1,
                      scale: 1,
                      y: isSpeaking ? [-1, 1, -1] : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      y: { repeat: isSpeaking ? Infinity : 0, duration: 0.5 },
                    }}
                  />
                </AnimatePresence>

                {/* Voice Activity Indicator - Mobile */}
                {(isListening || isSpeaking) && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <div
                      className={`flex items-center gap-1 backdrop-blur-sm rounded-full px-2 py-1 border ${
                        isListening
                          ? "bg-green-500/20 border-green-500/30"
                          : "bg-primary/20 border-primary/30"
                      }`}
                    >
                      {isListening ? (
                        <>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">
                            Listening
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-0.5 h-2 bg-primary rounded-full"
                                animate={{ scaleY: [1, 2, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.6,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-primary font-medium ml-1">
                            Speaking
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
