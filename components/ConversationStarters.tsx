import React from "react";
import { motion } from "framer-motion";

interface ConversationStartersProps {
  onSendMessage: (text: string) => void;
}

const starters = [
  "Hi Riya! How are you today? 😊",
  "Tell me something interesting about yourself",
  "What's your favorite way to spend time?",
  "I'm feeling a bit stressed, can you help?",
  "Let's talk about something fun!",
  "What do you think about relationships?",
];

export const ConversationStarters: React.FC<ConversationStartersProps> = ({
  onSendMessage,
}) => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-base font-medium">
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
            className="p-4 text-left bg-card rounded-2xl text-base text-foreground transition-all duration-300 w-full border border-border hover:border-primary-accent hover:bg-surface hover:shadow-lg hover:shadow-primary-accent/10"
          >
            {text}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
