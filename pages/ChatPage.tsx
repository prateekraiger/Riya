import React, { useCallback, useEffect, useState } from "react";
import { AvatarView } from "../components/AvatarView";
import { ChatPanel } from "../components/ChatPanel";
import { InteractivePanel } from "../components/InteractivePanel";
import { ChatHistorySidebar } from "../components/ChatHistorySidebar";
import { UserProfile } from "../components/UserProfile";
import { DailyCheckin } from "../components/DailyCheckin";
import { AchievementSystem } from "../components/AchievementSystem";
import { ConversationHighlights } from "../components/ConversationHighlights";
import { useChatStore } from "../store/useChatStore";
import { useAvatarStore } from "../store/useAvatarStore";
import { useConversationStore } from "../store/useConversationStore";
import { sendMessage } from "../services/geminiService";
import { 
  getChatHistory, 
  saveChatMessage, 
  getConversations, 
  createConversation, 
  updateConversationTitle,
  generateConversationTitle 
} from "../database/supabase";

import { useAuth } from "../hooks/useAuth";
import { Sender, Message } from "../types";
import { User, Heart, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type ChatMode = "chat" | "voice";

const ChatHeader: React.FC<{
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  onConversationSelect: (conversationId: string) => void;
  onSendMessage: (message: string) => void;
}> = ({ mode, onConversationSelect, onSendMessage }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-card/90 via-card/95 to-card/90 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <div className="relative flex-shrink-0">
          <img
            src="/assets/riya.png"
            alt="Riya avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-primary shadow-sm object-cover bg-white"
          />
          <span className="absolute -bottom-0.5 -right-0.5 block w-3 h-3 rounded-full bg-green-400 border-2 border-card shadow-sm"></span>
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-semibold text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark truncate">
            Riya AI
          </span>
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="truncate">
              {mode === "chat" ? "Online" : "Voice Active"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>("chat");
  const [showProfile, setShowProfile] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const {
    messages,
    setMessages,
    addMessage,
    setLastMessageContent,
    setIsLoading,
  } = useChatStore();
  const { setEmotion } = useAvatarStore();
  const { user } = useAuth();
  const {
    currentConversationId,
    setConversations,
    addConversation,
    setCurrentConversationId,
    updateConversation,
  } = useConversationStore();

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      if (user) {
        try {
          const userConversations = await getConversations(user.id);
          setConversations(userConversations);

          // If no conversations exist, create a default one
          if (userConversations.length === 0) {
            const newConversation = await createConversation(user.id);
            if (newConversation) {
              addConversation(newConversation);
              setCurrentConversationId(newConversation.id);
            }
          } else {
            // Set the most recent conversation as current
            setCurrentConversationId(userConversations[0].id);
          }
        } catch (error) {
          // Silent error handling
        }
      }
    };
    loadConversations();
  }, [user, setConversations, addConversation, setCurrentConversationId]);

  // Load messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (currentConversationId) {
        setIsLoading(true);
        try {
          const history = await getChatHistory(currentConversationId);
          setMessages(history);
        } catch (error) {
          // Silent error handling
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadMessages();
  }, [currentConversationId, setMessages, setIsLoading]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !user || !currentConversationId) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        text,
        sender: Sender.User,
      };

      // Construct history for the API call *before* updating the state with the AI placeholder
      const historyForApi = [...messages, userMessage];

      addMessage(userMessage);
      await saveChatMessage(userMessage, user.id, currentConversationId);

      // Update conversation title if this is the first message
      if (messages.length === 0) {
        const title = generateConversationTitle(text);
        await updateConversationTitle(currentConversationId, title);
        updateConversation(currentConversationId, { title });
      }

      setIsLoading(true);
      setEmotion("thinking");

      const aiMessageId = crypto.randomUUID();
      const aiPlaceholder: Message = {
        id: aiMessageId,
        text: "",
        sender: Sender.AI,
      };
      addMessage(aiPlaceholder);

      try {
        // Check message limit (20 messages per conversation)
        if (historyForApi.length > 20) {
          const limitText = "🚀 Oops! You've reached the 20 message limit for this conversation! \n\n💳 I'm working on premium plans for unlimited chats. For now, please start a new conversation to keep chatting with me! \n\n💝 Thanks for the amazing conversation! \n\n📧 Need help? Contact: https://www.instagram.com/dev.prat1k/ \n\n✨ Tip: Create a new chat to reset your message count!";
          setLastMessageContent(limitText);
          const limitMessage: Message = { ...aiPlaceholder, text: limitText };
          await saveChatMessage(limitMessage, user.id, currentConversationId);
          return;
        }

        const stream = sendMessage(
          historyForApi,
          user.id,
          currentConversationId
        );

        let fullResponse = "";
        for await (const chunk of stream) {
          fullResponse += chunk;
          setLastMessageContent(fullResponse);
        }

        if (fullResponse.trim() === "") {
          fullResponse =
            "I'm a little lost for words... Can we try that again?";
          setLastMessageContent(fullResponse);
        }

        const finalAiMessage: Message = {
          ...aiPlaceholder,
          text: fullResponse,
        };
        await saveChatMessage(finalAiMessage, user.id, currentConversationId);

        // Update conversation with last message
        updateConversation(currentConversationId, {
          last_message: fullResponse,
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        const errorText =
          "😔 Oops! I'm having some connection issues right now. Please try again in a moment! \n\n📱 If this keeps happening, reach out: https://www.instagram.com/dev.prat1k/";
        setLastMessageContent(errorText);
        const errorAiMessage: Message = { ...aiPlaceholder, text: errorText };
        await saveChatMessage(errorAiMessage, user.id, currentConversationId);
      } finally {
        setIsLoading(false);
        setEmotion("happy");
      }
    },
    [
      user,
      currentConversationId,
      messages,
      addMessage,
      setIsLoading,
      setEmotion,
      setLastMessageContent,
      updateConversation,
    ]
  );

  const handleConversationSelect = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return (
    <div className="flex flex-1 flex-col lg:flex-row w-full h-screen lg:min-h-[calc(100vh-7rem)] font-sans text-foreground relative overflow-hidden">
      {/* Avatar Section - Mobile: Hidden in portrait, Desktop: Left */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-full relative">
        <div className="relative z-10 w-full max-w-md lg:max-w-none flex-1 flex flex-col justify-center">
          <AvatarView
            mode={mode}
            onModeChange={setMode}
            onShowCheckin={() => setShowCheckin(true)}
            onShowAchievements={() => setShowAchievements(true)}
            onShowHighlights={() => setShowHighlights(true)}
            onShowProfile={() => setShowProfile(true)}
          />
        </div>
      </div>

      {/* Interactive Panel Section - Mobile: Full screen, Desktop: Right */}
      <div className="flex-1 lg:w-3/5 xl:w-1/2 flex flex-col h-full relative">
        <ChatPanel
          header={
            <ChatHeader
              mode={mode}
              setMode={setMode}
              onConversationSelect={handleConversationSelect}
              onSendMessage={handleSendMessage}
            />
          }
        >
          <InteractivePanel
            mode={mode}
            handleSendMessage={handleSendMessage}
            onModeChange={setMode}
            onConversationSelect={handleConversationSelect}
          />
        </ChatPanel>
      </div>

      {/* Mobile Avatar Button - Only show on small screens */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setShowProfile(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-dark shadow-lg flex items-center justify-center"
        >
          <User className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Modal Components */}
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <DailyCheckin
        isOpen={showCheckin}
        onClose={() => setShowCheckin(false)}
        onStartConversation={(message) => {
          setShowCheckin(false);
          handleSendMessage(message);
        }}
      />

      <AchievementSystem
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <ConversationHighlights
        isOpen={showHighlights}
        onClose={() => setShowHighlights(false)}
      />
    </div>
  );
};

export default ChatPage;
