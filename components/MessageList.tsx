import React, { useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Sender } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { TypingIndicator } from "./icons";
import { ConversationStarters } from "./ConversationStarters";

interface MessageListProps {
  onSendMessage: (text: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ onSendMessage }) => {
  const { messages, isLoading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 w-full max-w-lg"
        >
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-3xl blur-xl opacity-30"></div>
            <img
              src="/assets/riya.png"
              alt="Riya's mini avatar"
              className="relative w-32 h-32 rounded-3xl mx-auto border-4 border-border shadow-lg object-cover"
            />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-sm">
              Hi! I'm Riya 👋
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              I'm here to chat with you! You can either type your messages below
              or click the "Voice Chat" button above to talk with me directly.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm font-medium text-primary">
                  Text Chat
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                <span className="text-sm font-medium text-green-600">
                  Voice Chat
                </span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <ConversationStarters onSendMessage={onSendMessage} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex items-end gap-3 ${
              message.sender === Sender.User ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === Sender.AI && (
              <div className="flex flex-col items-center mr-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-accent to-primary-dark rounded-2xl blur-md opacity-30"></div>
                  <img
                    src="/assets/riya.png"
                    className="relative w-10 h-10 rounded-2xl self-start object-cover border-2 border-primary shadow-lg bg-white"
                    alt="Riya"
                  />
                </div>
                <span className="mt-1 text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark drop-shadow-sm select-none">
                  Riya
                </span>
              </div>
            )}
            <div
              className={`max-w-md lg:max-w-lg px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm ${
                message.sender === Sender.User
                  ? "bg-gradient-to-r from-primary to-primary-dark rounded-br-md border border-primary/30"
                  : "bg-secondary/60 text-foreground rounded-bl-md border border-primary/30 backdrop-blur-md"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-base">
                {/* Typing indicator within the bubble */}
                {isLoading &&
                  message.sender === Sender.AI &&
                  message.text === "" &&
                  index === messages.length - 1 && <TypingIndicator />}
                {message.text}
                {/* Blinking cursor for streaming text */}
                {isLoading &&
                  message.sender === Sender.AI &&
                  message.text !== "" &&
                  index === messages.length - 1 && (
                    <span className="inline-block w-0.5 h-5 bg-[#FF5D8F] animate-pulse ml-1 translate-y-0.5"></span>
                  )}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};
