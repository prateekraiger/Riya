import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConversationStore } from "../store/useConversationStore";
import { useChatStore } from "../store/useChatStore";
import {
  createConversation,
  deleteConversation,
  updateConversationTitle,
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

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    if (window.confirm(`Delete "${conversation.title}"?`)) {
      await deleteConversation(conversationId);
      removeConversation(conversationId);

      if (currentConversationId === conversationId) {
        const remaining = conversations.filter((c) => c.id !== conversationId);
        if (remaining.length > 0) {
          setCurrentConversationId(remaining[0].id);
          onConversationSelect(remaining[0].id);
        }
      }
    }
  };

  const handleEditTitle = (conversation: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveTitle = async (conversationId: string) => {
    if (!editTitle.trim()) return;

    await updateConversationTitle(conversationId, editTitle.trim());
    updateConversation(conversationId, { title: editTitle.trim() });
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
    if (diffDays <= 7) return `${diffDays - 1}d ago`;
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
        className="flex items-center gap-2 px-3 py-2 bg-secondary/50 hover:bg-secondary/70 text-foreground rounded-lg transition-colors border border-border/50"
        title="Chat History"
      >
        <History className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:block">History</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 border-2 border-primary rounded-xl shadow-xl z-[100] max-h-[70vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b-4 border-primary bg-gradient-to-r from-primary to-primary-dark">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <History className="w-6 h-6 text-white" />
                Chat History
              </h3>
              <span className="text-sm text-white bg-white/20 px-3 py-1 rounded-full font-medium">
                {conversations.length} chats
              </span>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white hover:bg-gray-50 text-primary border-2 border-white rounded-xl transition-all duration-200 text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {conversations.length === 0 ? (
              <div className="text-center py-16 text-foreground bg-white dark:bg-gray-800 m-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-primary" />
                <p className="text-lg font-semibold text-foreground">
                  No conversations yet
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  Click "Start New Chat" to begin your first conversation
                </p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative rounded-xl transition-all duration-200 cursor-pointer m-2 ${
                      currentConversationId === conversation.id
                        ? "bg-gradient-to-r from-primary to-primary-dark text-white border-2 border-primary shadow-lg"
                        : "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md border-2 border-gray-200 dark:border-gray-600 hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setCurrentConversationId(conversation.id);
                      onConversationSelect(conversation.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="p-4">
                      {editingId === conversation.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSaveTitle(conversation.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveTitle(conversation.id)}
                            className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4
                              className={`text-sm font-semibold line-clamp-1 flex-1 pr-2 ${
                                currentConversationId === conversation.id
                                  ? "text-white"
                                  : "text-foreground"
                              }`}
                            >
                              {conversation.title}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) =>
                                  handleEditTitle(conversation, e)
                                }
                                className="p-1.5 hover:bg-background/20 rounded-lg transition-colors"
                                title="Edit title"
                              >
                                <Edit3
                                  className={`w-3.5 h-3.5 ${
                                    currentConversationId === conversation.id
                                      ? "text-white/80 hover:text-white"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                />
                              </button>
                              <button
                                onClick={(e) =>
                                  handleDeleteConversation(conversation.id, e)
                                }
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Delete conversation"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                              </button>
                            </div>
                          </div>

                          {conversation.last_message && (
                            <p
                              className={`text-xs line-clamp-2 leading-relaxed ${
                                currentConversationId === conversation.id
                                  ? "text-white/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {truncateText(conversation.last_message, 60)}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`font-medium ${
                                currentConversationId === conversation.id
                                  ? "text-white/60"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatDate(conversation.updated_at)}
                            </span>
                            {conversation.message_count && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  currentConversationId === conversation.id
                                    ? "bg-white/20 text-white"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {conversation.message_count} msgs
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
