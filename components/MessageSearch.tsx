import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  X,
  Calendar,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import { searchMessages } from "../database/supabase";
import { useAuth } from "../hooks/useAuth";
import { Message, Sender } from "../types";

interface MessageSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onMessageSelect?: (message: Message) => void;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  isOpen,
  onClose,
  onMessageSelect,
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Search messages when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim() || !user) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchMessages(user.id, query);
        setResults(searchResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, user]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex] && onMessageSelect) {
            onMessageSelect(results[selectedIndex]);
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onMessageSelect, onClose]);

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

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[70vh] sm:max-h-[65vh] overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your conversations..."
              className="flex-1 bg-transparent text-lg placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : query.trim() === "" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Search Your Messages
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Type to search through all your conversations with Riya. Find
                specific topics, dates, or keywords.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Results Found
              </h3>
              <p className="text-sm text-muted-foreground">
                No messages found for "{query}". Try different keywords.
              </p>
            </div>
          ) : (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2 mb-2">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </div>
              {results.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    index === selectedIndex
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-secondary/50"
                  }`}
                  onClick={() => {
                    if (onMessageSelect) {
                      onMessageSelect(message);
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        message.sender === Sender.User
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {message.sender === Sender.User ? (
                        <UserIcon className="w-4 h-4" />
                      ) : (
                        "R"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender === Sender.User ? "You" : "Riya"}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {message.created_at
                            ? formatDate(message.created_at)
                            : "Recently"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">
                        {highlightText(message.text, query)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 border-t border-border bg-secondary/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <span>
                {selectedIndex + 1} of {results.length}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
