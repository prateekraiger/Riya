import React from "react";
import { motion } from "framer-motion";
import { Sender, Message as MessageType } from "../types";
import { TypingIndicator } from "./icons";
import { MessageReactions } from "./MessageReactions";
import { Heart } from "lucide-react";

interface MessageProps {
  message: MessageType;
  isLoading: boolean;
  user: any; // Replace 'any' with actual user type if available
  messageReactions: Record<string, any[]>; // Reactions for the current message
  handleAddReaction: (messageId: string, reactionType: string) => void;
  handleRemoveReaction: (messageId: string, reactionType: string) => void;
  handleToggleFavorite: (messageId: string, currentFavorite: boolean) => void;
  index: number;
  messagesLength: number;
}

export const Message: React.FC<MessageProps> = ({
  message,
  isLoading,
  user,
  messageReactions,
  handleAddReaction,
  handleRemoveReaction,
  handleToggleFavorite,
  index,
  messagesLength,
}) => {
  return (
    <motion.div
      key={message.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group flex items-end gap-3 ${
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
      <div className="flex flex-col max-w-md lg:max-w-lg">
        <div
          className={`px-6 py-4 rounded-3xl shadow-lg backdrop-blur-sm ${
            message.sender === Sender.User
              ? "bg-gradient-to-r from-primary to-primary-dark rounded-br-md border border-primary/30"
              : "bg-secondary/60 text-foreground rounded-bl-md border border-primary/30 backdrop-blur-md"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="whitespace-pre-wrap leading-relaxed text-base flex-1">
              {/* Typing indicator within the bubble */}
              {isLoading &&
                message.sender === Sender.AI &&
                message.text === "" &&
                index === messagesLength - 1 && <TypingIndicator />}
              {message.text}
              {/* Blinking cursor for streaming text */}
              {isLoading &&
                message.sender === Sender.AI &&
                message.text !== "" &&
                index === messagesLength - 1 && (
                  <span className="inline-block w-0.5 h-5 bg-[#FF5D8F] animate-pulse ml-1 translate-y-0.5"></span>
                )}
            </p>

            {/* Message Actions */}
            {!isLoading && message.text && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    handleToggleFavorite(message.id, message.is_favorite || false)
                  }
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${
                    message.is_favorite ? "text-red-400" : "text-white/60 hover:text-white"
                  }`}
                  title={
                    message.is_favorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`w-3 h-3 ${message.is_favorite ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Reactions */}
        {!isLoading && message.text && user && (
          <MessageReactions
            messageId={message.id}
            reactions={messageReactions[message.id] || []}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
            currentUserId={user.id}
          />
        )}
      </div>
    </motion.div>
  );
};
