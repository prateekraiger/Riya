import React from "react";

interface ChatPanelProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ children, header }) => {
  return (
    <div className="flex flex-col h-full w-full bg-card/90 backdrop-blur-xl border-l border-border shadow-lg pt-24">
      {header && <div className="border-b border-border">{header}</div>}
      {children}
    </div>
  );
};
