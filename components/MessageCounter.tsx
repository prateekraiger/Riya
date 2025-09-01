import React from "react";
import { useChatStore } from "../store/useChatStore";

export const MessageCounter: React.FC = () => {
  const { messages } = useChatStore();
  const messageCount = messages.length;
  const remaining = Math.max(0, 20 - messageCount);
  
  if (messageCount < 15) return null;
  
  return (
    <div className={`text-xs px-2 py-1 rounded-full ${
      remaining <= 2 ? 'bg-red-100 text-red-600' : 
      remaining <= 5 ? 'bg-yellow-100 text-yellow-600' : 
      'bg-blue-100 text-blue-600'
    }`}>
      {remaining} messages left
    </div>
  );
};