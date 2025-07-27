import React from "react";
import { motion } from "framer-motion";

interface ChatPanelProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ children, header }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col h-full w-full bg-gradient-to-br from-card/95 via-card/90 to-card/85 backdrop-blur-xl border-l border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary-dark/[0.02] pointer-events-none" />

      {/* Header */}
      {header && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative z-10 border-b border-border/30 bg-card/80 backdrop-blur-sm"
        >
          {header}
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex-1 relative z-10 overflow-hidden"
      >
        {children}
      </motion.div>

      {/* Mobile-specific improvements */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
    </motion.div>
  );
};
