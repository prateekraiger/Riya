import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Share2,
  Calendar,
  MessageCircle,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Modal } from "./ui/Modal";
import { useAuth } from "../hooks/useAuth";
import { Message, Sender } from "../types";
import { getChatHistory, getConversations } from "../database/supabase";

interface ConversationHighlight {
  id: string;
  conversation_id: string;
  message_ids: string[];
  title: string;
  description: string;
  created_at: string;
  messages: Message[];
}

interface ConversationHighlightsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationHighlights: React.FC<ConversationHighlightsProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<ConversationHighlight[]>([]);
  const [favoriteMessages, setFavoriteMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load highlights and favorite messages
  useEffect(() => {
    if (isOpen && user) {
      loadHighlights();
    }
  }, [isOpen, user]);

  const loadHighlights = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get all conversations
      const conversations = await getConversations(user.id);

      // Get favorite messages from all conversations
      const allFavorites: Message[] = [];
      const autoHighlights: ConversationHighlight[] = [];

      for (const conversation of conversations) {
        const messages = await getChatHistory(conversation.id);
        const favorites = messages.filter((msg) => msg.is_favorite);
        allFavorites.push(...favorites);

        // Auto-generate highlights from meaningful conversations
        const meaningfulExchanges = findMeaningfulExchanges(
          messages,
          conversation
        );
        autoHighlights.push(...meaningfulExchanges);
      }

      setFavoriteMessages(allFavorites);
      setHighlights(autoHighlights);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const findMeaningfulExchanges = (
    messages: Message[],
    conversation: any
  ): ConversationHighlight[] => {
    const highlights: ConversationHighlight[] = [];

    // Find long conversations (meaningful exchanges)
    for (let i = 0; i < messages.length - 3; i += 4) {
      const exchange = messages.slice(i, i + 4);
      if (exchange.length >= 4) {
        const userMessages = exchange.filter(
          (msg) => msg.sender === Sender.User
        );
        const aiMessages = exchange.filter((msg) => msg.sender === Sender.AI);

        if (userMessages.length >= 2 && aiMessages.length >= 2) {
          // Check if it's a meaningful exchange (contains emotional keywords)
          const combinedText = exchange
            .map((msg) => msg.text)
            .join(" ")
            .toLowerCase();
          const emotionalKeywords = [
            "love",
            "happy",
            "sad",
            "excited",
            "worried",
            "grateful",
            "thank",
            "amazing",
            "wonderful",
            "beautiful",
            "special",
            "important",
            "care",
            "support",
            "understand",
            "feel",
            "heart",
            "dream",
            "hope",
          ];

          const hasEmotionalContent = emotionalKeywords.some((keyword) =>
            combinedText.includes(keyword)
          );

          if (hasEmotionalContent) {
            highlights.push({
              id: `auto-${conversation.id}-${i}`,
              conversation_id: conversation.id,
              message_ids: exchange.map((msg) => msg.id),
              title: generateHighlightTitle(exchange),
              description: `A meaningful conversation from ${new Date(
                conversation.created_at
              ).toLocaleDateString()}`,
              created_at: exchange[0].created_at || new Date().toISOString(),
              messages: exchange,
            });
          }
        }
      }
    }

    return highlights.slice(0, 10); // Limit to 10 auto-highlights
  };

  const generateHighlightTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find((msg) => msg.sender === Sender.User);
    if (firstUserMessage) {
      const words = firstUserMessage.text.split(" ").slice(0, 6);
      return (
        words.join(" ") +
        (firstUserMessage.text.split(" ").length > 6 ? "..." : "")
      );
    }
    return "Meaningful Conversation";
  };

  const handleCopyHighlight = async (highlight: ConversationHighlight) => {
    const text = highlight.messages
      .map(
        (msg) => `${msg.sender === Sender.User ? "You" : "Riya"}: ${msg.text}`
      )
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(highlight.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleShareHighlight = (highlight: ConversationHighlight) => {
    if (navigator.share) {
      navigator.share({
        title: `Conversation with Riya: ${highlight.title}`,
        text: highlight.messages
          .map(
            (msg) =>
              `${msg.sender === Sender.User ? "Me" : "Riya"}: ${msg.text}`
          )
          .join("\n\n"),
      });
    } else {
      handleCopyHighlight(highlight);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conversation Highlights"
      subtitle="Your special moments with Riya"
      icon={
        <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-accent rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      }
      maxWidth="4xl"
    >
      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Favorite Messages Section */}
            {favoriteMessages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Favorite Messages ({favoriteMessages.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteMessages.slice(0, 6).map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-secondary/30 rounded-lg p-4 border border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            message.sender === Sender.User
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {message.sender === Sender.User ? "You" : "R"}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground line-clamp-3">
                            {message.text}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {message.created_at
                                ? formatDate(message.created_at)
                                : "Recently"}
                            </span>
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-Generated Highlights */}
            {highlights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Meaningful Conversations ({highlights.length})
                </h3>
                <div className="space-y-4">
                  {highlights.map((highlight) => (
                    <motion.div
                      key={highlight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-primary/5 to-primary-accent/5 rounded-lg p-6 border border-primary/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {highlight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {highlight.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyHighlight(highlight)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Copy conversation"
                          >
                            {copiedId === highlight.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleShareHighlight(highlight)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Share conversation"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {highlight.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.sender === Sender.User
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                message.sender === Sender.User
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-secondary text-secondary-foreground rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(highlight.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageCircle className="w-3 h-3" />
                          {highlight.messages.length} messages
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {favoriteMessages.length === 0 &&
              highlights.length === 0 &&
              !isLoading && (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No highlights yet
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Start having meaningful conversations with Riya, and your
                    special moments will appear here. You can also favorite
                    messages by clicking the heart icon.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </Modal>
  );
};
