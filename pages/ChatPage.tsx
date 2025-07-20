import React, { useCallback, useEffect } from "react";
import { AvatarView } from "../components/AvatarView";
import { ChatPanel } from "../components/ChatPanel";
import { MessageList } from "../components/MessageList";
import { ChatInput } from "../components/ChatInput";
import { useChatStore } from "../store/useChatStore";
import { useAvatarStore } from "../store/useAvatarStore";
import { sendMessage } from "../services/geminiService";
import { getChatHistory, saveChatMessage } from "../supabase";
import { useAuth } from "../hooks/useAuth";
import { Sender, Message } from "../types";

const ChatHeader = () => (
  <div className="flex items-center gap-4 px-6 py-4 bg-card/80">
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
);

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
    <div className="flex flex-1 flex-col md:flex-row w-full h-full font-sans bg-background text-foreground relative overflow-hidden pt-24">
      {/* Background Pattern */} 
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(142,202,230,0.08),transparent_50%)] pointer-events-none"></div>

      {/* Avatar Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-8 min-h-[50vh] md:min-h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/30"></div>
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
          <div className="p-4 md:p-6 border-t border-border flex-shrink-0 bg-gradient-to-r from-transparent via-secondary/60 to-transparent">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </ChatPanel>
      </div>
    </div>
  );
};

export default ChatPage;
