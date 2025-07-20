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
    <div className="flex flex-1 flex-col md:flex-row w-full h-full font-sans bg-slate-900 text-white">
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 bg-slate-800/30 min-h-[50vh] md:min-h-full">
        <AvatarView />
      </div>
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col min-h-[50vh] md:min-h-full">
        <ChatPanel>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0">
            <MessageList onSendMessage={handleSendMessage} />
          </div>
          <div className="p-2 md:p-4 border-t border-white/5 flex-shrink-0">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </ChatPanel>
      </div>
    </div>
  );
};

export default ChatPage;
