import React from "react";
import { motion } from "framer-motion";

interface VoiceIndicatorProps {
  isActive: boolean;
  audioLevel?: number;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({
  isActive,
  audioLevel = 0,
}) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full p-2 shadow-lg border-2 border-white"
    >
      {/* Voice wave animation */}
      <div className="flex items-center gap-0.5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-0.5 bg-white rounded-full"
            animate={{
              height: [4, 8 + audioLevel * 10, 4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
