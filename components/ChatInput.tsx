import React, { useState, useCallback, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { SendIcon } from "./icons";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState("");
  const { isLoading } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = useCallback(() => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText("");
    }
  }, [text, isLoading, onSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 bg-card/90 backdrop-blur-xl p-4 rounded-2xl border border-border focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/25 transition-all duration-300">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Say something to Riya..."
        rows={1}
        className="flex-1 bg-transparent resize-none focus:outline-none p-2 placeholder-muted-foreground disabled:opacity-50 max-h-40 text-foreground text-base"
        disabled={isLoading}
      />

      <button
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        title="Send message"
        className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-all duration-200 disabled:bg-surface disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
