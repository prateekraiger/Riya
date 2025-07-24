import React, { useCallback, useEffect, useState } from "react";
import { AvatarView } from "../components/AvatarView";
import { ChatPanel } from "../components/ChatPanel";
import { MessageList } from "../components/MessageList";
import { ChatInput } from "../components/ChatInput";
import { VoiceChatPanel } from "../components/VoiceChatPanel";
import { useChatStore } from "../store/useChatStore";
import { useAvatarStore } from "../store/useAvatarStore";
import { sendMessage } from "../services/geminiService";
import { getChatHistory, saveChatMessage } from "../database/supabase";
import { useAuth } from "../hooks/useAuth";
import { Sender, Message } from "../types";

const ChatHeader = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  return (
    <>
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
              Online
            </span>
          </div>
        </div>

        {/* Voice Chat Button */}
        <button
          onClick={() => setShowVoiceChat(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200 hover:scale-105"
          title="Start voice chat"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="text-sm font-medium">Voice</span>
        </button>
      </div>

      {/* Voice Chat Panel */}
      <VoiceChatPanel
        isOpen={showVoiceChat}
        onClose={() => setShowVoiceChat(false)}
      />
    </>
  );
};

const ChatPage: React.FC = () => {
  const {
    messages,
    setMessages,
    addMessage,
    setLastMessageContent,
    setIsLoading,
  } = useChatStore();
  const { setEmotion } = useAvatarStore();
  const { user } = useAuth();

  useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const history = await getChatHistory(user.id);
          setMessages(history);
        } catch (error) {
          console.error("Failed to load chat history:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadHistory();
  }, [user, setMessages, setIsLoading]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !user) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        text,
        sender: Sender.User,
      };

      // Construct history for the API call *before* updating the state with the AI placeholder
      const historyForApi = [...messages, userMessage];

      addMessage(userMessage);
      await saveChatMessage(userMessage, user.id);

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
        await saveChatMessage(finalAiMessage, user.id);
      } catch (error) {
        console.error("Failed to get response from AI", error);
        const errorText =
          "Sorry, I'm having a little trouble connecting right now. Let's try again in a moment.";
        setLastMessageContent(errorText);
        const errorAiMessage: Message = { ...aiPlaceholder, text: errorText };
        await saveChatMessage(errorAiMessage, user.id);
      } finally {
        setIsLoading(false);
        setEmotion("happy");
      }
    },
    [
      user,
      messages,
      addMessage,
      setIsLoading,
      setEmotion,
      setLastMessageContent,
    ]
  );

  return (
    <div className="flex flex-1 flex-col md:flex-row w-full h-full font-sans text-foreground relative overflow-hidden pt-8">
      {/* Background Pattern */}
      {/* <Background variant="chat" /> */}
      {/* Avatar Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-8 min-h-[50vh] md:min-h-full relative">
        {/* Background is handled by the Background component */}
        <div className="relative z-10">
          <AvatarView />
        </div>
      </div>
      {/* Chat Section */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col min-h-[50vh] md:min-h-full relative pb-16">
        <ChatPanel header={<ChatHeader />}>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
            <MessageList onSendMessage={handleSendMessage} />
          </div>
          <div className="p-4 md:p-6 border-t border-border flex-shrink-0">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </ChatPanel>
      </div>
    </div>
  );
};

export default ChatPage;
