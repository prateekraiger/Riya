import { Send } from "lucide-react";

export const SendIcon = Send;
import * as React from "react";

export const TypingIndicator: React.FC = () => (
  <span className="flex items-center space-x-1.5 p-1">
    <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></span>
  </span>
);
