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
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent drop-shadow-sm">
              Your conversation starts here
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Send a message to get things started. I'm excited to talk to you!
            </p>
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
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white rounded-br-md border border-primary/30"
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
