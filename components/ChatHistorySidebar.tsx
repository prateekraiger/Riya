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
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-[100] max-h-[60vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border bg-secondary/30">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4" />
                Chat History
              </h3>
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                {conversations.length}
              </span>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 p-2 mt-3 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="max-h-80 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative rounded-lg transition-colors cursor-pointer p-3 mb-1 ${
                      currentConversationId === conversation.id
                        ? "bg-primary text-white"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => {
                      setCurrentConversationId(conversation.id);
                      onConversationSelect(conversation.id);
                      setIsOpen(false);
                    }}
                  >
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
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-sm font-medium truncate flex-1 ${
                            currentConversationId === conversation.id
                              ? "text-white"
                              : "text-foreground"
                          }`}
                        >
                          {conversation.title}
                        </h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={(e) => handleEditTitle(conversation, e)}
                            className="p-1 hover:bg-secondary rounded"
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3 text-muted-foreground" />
                          </button>
                          <button
                            onClick={(e) =>
                              handleDeleteConversation(conversation.id, e)
                            }
                            className="p-1 hover:bg-red-500/20 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    )}
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
