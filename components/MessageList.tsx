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
          className="space-y-4 w-full max-w-md"
        >
          <motion.img
            src="/assets/riya1.png"
            alt="Riya's mini avatar"
            className="w-24 h-24 rounded-2xl mx-auto border-2 border-white/20 shadow-lg object-cover"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          />
          <h1 className="text-2xl font-bold text-slate-100">
            Your conversation starts here
          </h1>
          <p className="text-slate-400 max-w-sm mx-auto">
            Send a message to get things started. I'm excited to talk to you!
          </p>
          <div className="pt-4">
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
              <img
                src="/assets/riya1.png"
                className="w-8 h-8 rounded-lg self-start object-cover"
                alt="Riya"
              />
            )}
            <div
              className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${
                message.sender === Sender.User
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-slate-700 text-slate-200 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">
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
                    <span className="inline-block w-0.5 h-4 bg-pink-400 animate-pulse ml-1 translate-y-0.5"></span>
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
