import React from "react";
import { motion } from "framer-motion";

interface ConversationStartersProps {
  onSendMessage: (text: string) => void;
}

const starters = [
  "Tell me a fun fact about you.",
  "What do you like to do for fun?",
  "How was your day today?",
  "What's something you're excited about?",
];

export const ConversationStarters: React.FC<ConversationStartersProps> = ({
  onSendMessage,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-[#3D1C20]/80 text-base font-medium">
        Or try one of these to get started:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {starters.map((text, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5 + i * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSendMessage(text)}
            className="p-4 text-left bg-white/60 backdrop-blur-sm rounded-2xl text-base text-[#3D1C20] transition-all duration-300 w-full border border-[#FFC3D5]/40 hover:border-[#FF5D8F]/50 hover:bg-white/80 hover:shadow-lg hover:shadow-[#FF5D8F]/20"
          >
            {text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
