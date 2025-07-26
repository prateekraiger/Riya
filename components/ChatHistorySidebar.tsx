import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConversationStore } from "../store/useConversationStore";
import { useChatStore } from "../store/useChatStore";
import {
  createConversation,
  deleteConversation,
  updateConversationTitle,
  generateConversationTitle,
} from "../database/supabase";
import { useAuth } from "../hooks/useAuth";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  History,
  MoreVertical,
} from "lucide-react";

interface ChatHistorySidebarProps {
  onConversationSelect: (conversationId: string) => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  onConversationSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const {
    conversations,
    currentConversationId,
    addConversation,
    updateConversation,
    deleteConversation: removeConversation,
    setCurrentConversationId,
  } = useConversationStore();
  const { clearMessages } = useChatStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = async () => {
    if (!user) return;

    const newConversation = await createConversation(user.id);
    if (newConversation) {
      addConversation(newConversation);
      setCurrentConversationId(newConversation.id);
      clearMessages();
      onConversationSelect(newConversation.id);
      setIsOpen(false);
    }
  };

  const handleDeleteConversation = async (
    conversationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    // Find the conversation to get its title for confirmation
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    const conversationTitle = conversation?.title || "this conversation";

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${conversationTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const success = await deleteConversation(conversationId);
    if (success) {
      removeConversation(conversationId);
      if (currentConversationId === conversationId) {
        clearMessages();
        // If we deleted the current conversation, switch to the first available one
        const remainingConversations = conversations.filter(
          (conv) => conv.id !== conversationId
        );
        if (remainingConversations.length > 0) {
          setCurrentConversationId(remainingConversations[0].id);
          onConversationSelect(remainingConversations[0].id);
        }
      }
    } else {
      alert("Failed to delete conversation. Please try again.");
    }
  };

  const handleEditTitle = (conversation: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveTitle = async (conversationId: string) => {
    if (!editTitle.trim()) return;

    const success = await updateConversationTitle(
      conversationId,
      editTitle.trim()
    );
    if (success) {
      updateConversation(conversationId, { title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-colors border border-border/50"
      >
        <History className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:block">
          {currentConversation
            ? truncateText(currentConversation.title, 15)
            : "Chat History"}
        </span>
        <MoreVertical className="w-3 h-3" />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-borr">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Chat History
                </h3>
                <span className="text-xs text-muted-foreground">
                  {conversations.length} chats
                </span>
              </div>

              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Conversations List */}
            <div className="max-h-64 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`group relative mb-1 rounded-md transition-colors cursor-pointer ${
                        currentConversationId === conversation.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-secondary/50"
                      }`}
                      onClick={() => {
                        setCurrentConversationId(conversation.id);
                        onConversationSelect(conversation.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="p-3">
                        {editingId === conversation.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded"
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleSaveTitle(conversation.id);
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveTitle(conversation.id)}
                              className="p-1 hover:bg-green-500/20 rounded"
                            >
                              <Check className="w-3 h-3 text-green-600" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 hover:bg-red-500/20 rounded"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium text-foreground line-clamp-1 flex-1 pr-2">
                                {conversation.title}
                              </h4>
                              <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 sm:opacity-60 sm:hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) =>
                                    handleEditTitle(conversation, e)
                                  }
                                  className="p-1.5 hover:bg-secondary rounded transition-colors"
                                  title="Edit title"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                </button>
                                <button
                                  onClick={(e) =>
                                    handleDeleteConversation(conversation.id, e)
                                  }
                                  className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                                  title="Delete conversation"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                                </button>
                              </div>
                            </div>

                            {conversation.last_message && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {truncateText(conversation.last_message, 40)}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatDate(conversation.updated_at)}</span>
                              {conversation.message_count && (
                                <span>{conversation.message_count} msgs</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
