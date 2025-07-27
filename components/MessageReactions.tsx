import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Laugh, Angry, Plus } from "lucide-react";
import { MessageReaction } from "../types";

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReaction[];
  onAddReaction: (messageId: string, reactionType: string) => void;
  onRemoveReaction: (messageId: string, reactionType: string) => void;
  currentUserId: string;
}

const reactionOptions = [
  {
    type: "heart",
    emoji: "❤️",
    icon: Heart,
    label: "Love",
    color: "text-red-500",
  },
  {
    type: "laugh",
    emoji: "😂",
    icon: Laugh,
    label: "Funny",
    color: "text-yellow-500",
  },
  {
    type: "angry",
    emoji: "😠",
    icon: Angry,
    label: "Angry",
    color: "text-red-600",
  },
  {
    type: "love",
    emoji: "🥰",
    icon: Heart,
    label: "Adore",
    color: "text-pink-500",
  },
];

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions,
  onAddReaction,
  onRemoveReaction,
  currentUserId,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  // Group reactions by type and count them
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Check if current user has reacted with specific type
  const hasUserReacted = (reactionType: string) => {
    return reactions.some(
      (r) => r.user_id === currentUserId && r.reaction_type === reactionType
    );
  };

  const handleReactionClick = (reactionType: string) => {
    if (hasUserReacted(reactionType)) {
      onRemoveReaction(messageId, reactionType);
    } else {
      onAddReaction(messageId, reactionType);
    }
    setShowReactionPicker(false);
  };

  const displayedReactions = Object.entries(reactionCounts).filter(
    ([_, count]) => count > 0
  );

  return (
    <div className="flex items-center gap-1 mt-2 relative">
      {/* Existing Reactions */}
      <AnimatePresence>
        {displayedReactions.map(([reactionType, count]) => {
          const reactionOption = reactionOptions.find(
            (r) => r.type === reactionType
          );
          const userReacted = hasUserReacted(reactionType);

          return (
            <motion.button
              key={reactionType}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReactionClick(reactionType)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                userReacted
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              title={`${reactionOption?.label} (${count})`}
            >
              <span className="text-sm">{reactionOption?.emoji}</span>
              <span className="font-medium">{count}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Add Reaction Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Add reaction"
        >
          <Plus className="w-3 h-3" />
        </motion.button>

        {/* Reaction Picker */}
        <AnimatePresence>
          {showReactionPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 flex gap-1 z-10"
            >
              {reactionOptions.map((reaction) => (
                <motion.button
                  key={reaction.type}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactionClick(reaction.type)}
                  className={`p-2 rounded-lg hover:bg-secondary transition-colors ${
                    hasUserReacted(reaction.type) ? "bg-primary/10" : ""
                  }`}
                  title={reaction.label}
                >
                  <span className="text-lg">{reaction.emoji}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {showReactionPicker && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowReactionPicker(false)}
        />
      )}
    </div>
  );
};
