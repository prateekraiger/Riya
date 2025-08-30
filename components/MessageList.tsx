import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import { ConversationStarters } from "./ConversationStarters";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { MessageSearch } from "./MessageSearch";
import { useAuth } from "../hooks/useAuth";
async function addMessageReaction(messageId: string, userId: string, reactionType: string) {
  try {
    const response = await fetch('/api/messageReactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId, userId, reactionType }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error adding message reaction:", error);
    return false;
  }
}

async function removeMessageReaction(messageId: string, userId: string, reactionType: string) {
  try {
    const response = await fetch(`/api/messageReactions?messageId=${messageId}&userId=${userId}&reactionType=${reactionType}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error removing message reaction:", error);
    return false;
  }
}

async function getMessageReactions(messageId: string) {
  try {
    const response = await fetch(`/api/messageReactions?messageId=${messageId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching message reactions:", error);
    return [];
  }
}

async function toggleMessageFavorite(messageId: string, isFavorite: boolean) {
  try {
    const response = await fetch(`/api/messageActions?messageId=${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error toggling message favorite:", error);
    return false;
  }
}

import { History, MessageCircle, Mic } from "lucide-react";
import { Message } from "./Message";

interface MessageListProps {
  onSendMessage: (text: string) => void;
  onConversationSelect?: (conversationId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  onSendMessage,
  onConversationSelect,
}) => {
  const { messages, isLoading } = useChatStore();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [messageReactions, setMessageReactions] = useState<
    Record<string, any[]>
  >({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load reactions for messages
  useEffect(() => {
    const loadReactions = async () => {
      const reactionsMap: Record<string, any[]> = {};
      for (const message of messages) {
        const reactions = await getMessageReactions(message.id);
        reactionsMap[message.id] = reactions;
      }
      setMessageReactions(reactionsMap);
    };

    if (messages.length > 0) {
      loadReactions();
    }
  }, [messages]);

  const handleAddReaction = async (messageId: string, reactionType: string) => {
    if (!user) return;

    const success = await addMessageReaction(messageId, user.id, reactionType);
    if (success) {
      // Reload reactions for this message
      const reactions = await getMessageReactions(messageId);
      setMessageReactions((prev) => ({
        ...prev,
        [messageId]: reactions,
      }));
    }
  };

  const handleRemoveReaction = async (
    messageId: string,
    reactionType: string
  ) => {
    if (!user) return;

    const success = await removeMessageReaction(
      messageId,
      user.id,
      reactionType
    );
    if (success) {
      // Reload reactions for this message
      const reactions = await getMessageReactions(messageId);
      setMessageReactions((prev) => ({
        ...prev,
        [messageId]: reactions,
      }));
    }
  };

  const handleToggleFavorite = async (
    messageId: string,
    currentFavorite: boolean
  ) => {
    const success = await toggleMessageFavorite(messageId, !currentFavorite);
    if (success) {
      // Update local state or reload messages
    }
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <React.Fragment>
        {/* History Button for Empty State */}
        <div className="absolute top-4 right-4 z-10">
          <ChatHistorySidebar
            onConversationSelect={onConversationSelect || (() => {})}
          />
        </div>

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
                I'm here to chat with you! You can either type your messages
                below or click the "Voice Chat" button above to talk with me
                directly.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Text Chat
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                  <Mic className="w-5 h-5 text-green-600" />
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

        {/* Search Modal */}
        <MessageSearch
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
        />
      </React.Fragment>
    );
  }

  return (
    <>
      {/* History Button */}
      <div className="absolute top-4 right-4 z-10">
        <ChatHistorySidebar
          onConversationSelect={onConversationSelect || (() => {})}
        />
      </div>

      <div className="space-y-6 pt-16">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isLoading={isLoading}
              user={user}
              messageReactions={messageReactions}
              handleAddReaction={handleAddReaction}
              handleRemoveReaction={handleRemoveReaction}
              handleToggleFavorite={handleToggleFavorite}
              index={index}
              messagesLength={messages.length}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};
