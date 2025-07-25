import React, { useCallback, useEffect, useState } from "react";
import { AvatarView } from "../components/AvatarView";
import { ChatPanel } from "../components/ChatPanel";
import { InteractivePanel } from "../components/InteractivePanel";
import { ChatHistorySidebar } from "../components/ChatHistorySidebar";
import { useChatStore } from "../store/useChatStore";
import { useAvatarStore } from "../store/useAvatarStore";
import { useConversationStore } from "../store/useConversationStore";
import { sendMessage } from "../services/geminiService";
import {
  getChatHistory,
  saveChatMessage,
  getConversations,
  createConversation,
  generateConversationTitle,
  updateConversationTitle,
} from "../database/supabase";
import { useAuth } from "../hooks/useAuth";
import { Sender, Message } from "../types";

type ChatMode = "chat" | "voice";

const ChatHeader: React.FC<{
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  onConversationSelect: (conversationId: string) => void;
}> = ({ mode, onConversationSelect }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-card/80">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-accent to-primary-dark rounded-2xl blur-md opacity-30"></div>
        <img
          src="/assets/riya.png"
          alt="Riya avatar"
          className="relative w-12 h-12 rounded-2xl border-2 border-primary shadow-md object-cover bg-white"
        />
        <span className="absolute bottom-1 right-1 block w-3 h-3 rounded-full bg-green-400 border-2 border-card shadow"></span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark drop-shadow-sm select-none">
          Riya
        </span>
        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Online • {mode === "chat" ? "Text Chat" : "Voice Chat"}
        </span>
      </div>
    </div>

    {/* Chat History Sidebar positioned in header */}
    <div className="relative">
      <ChatHistorySidebar onConversationSelect={onConversationSelect} />
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const [mode, setMode] = useState<ChatMode>("chat");
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
    conversations,
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
          console.error("Failed to load conversations:", error);
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
          console.error("Failed to load chat history:", error);
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
        const stream = sendMessage(historyForApi);

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
        console.error("Failed to get response from AI", error);
        const errorText =
          "Sorry, I'm having a little trouble connecting right now. Let's try again in a moment.";
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
    <div className="flex flex-1 flex-col md:flex-row w-full h-full font-sans text-foreground relative overflow-hidden pt-8">
      {/* Avatar Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-8 min-h-[50vh] md:min-h-full relative">
        <div className="relative z-10">
          <AvatarView mode={mode} onModeChange={setMode} />
        </div>
      </div>
      {/* Interactive Panel Section */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col min-h-[50vh] md:min-h-full relative pb-16">
        <ChatPanel
          header={
            <ChatHeader
              mode={mode}
              setMode={setMode}
              onConversationSelect={handleConversationSelect}
            />
          }
        >
          <InteractivePanel
            mode={mode}
            handleSendMessage={handleSendMessage}
            onModeChange={setMode}
          />
        </ChatPanel>
      </div>
    </div>
  );
};

export default ChatPage;
