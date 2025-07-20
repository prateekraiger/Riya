import React from 'react';
import { motion } from 'framer-motion';

interface ConversationStartersProps {
  onSendMessage: (text: string) => void;
}

const starters = [
  "Tell me a fun fact about you.",
  "What do you like to do for fun?",
  "How was your day today?",
  "What's something you're excited about?"
];

export const ConversationStarters: React.FC<ConversationStartersProps> = ({ onSendMessage }) => {
  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-sm">Or try one of these to get started:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {starters.map((text, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.03, backgroundColor: 'hsl(222.2 47.4% 15.2%)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSendMessage(text)}
            className="p-3 text-left bg-slate-700/50 rounded-lg text-sm text-slate-200 transition-colors w-full border border-slate-600/80"
          >
            {text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
