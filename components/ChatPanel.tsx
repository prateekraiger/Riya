
import React from 'react';

interface ChatPanelProps {
  children: React.ReactNode;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-800/50 backdrop-blur-sm border-l border-white/5">
      {children}
    </div>
  );
};
