import React from "react";

interface ChatPanelProps {
  children: React.ReactNode;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white/60 backdrop-blur-xl border-l border-[#FFC3D5]/40 shadow-2xl">
      {children}
    </div>
  );
};
