
import React, { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { VoiceChatPanel } from "./VoiceChatPanel";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { Message, Sender } from "../types";
import { useAuth } from "../hooks/useAuth";
import { saveChatMessage } from "../database/supabase";
import { useChatStore } from "../store/useChatStore";
import { useAvatarStore } from "../store/useAvatarStore";
import { sendMessage } from "../services/geminiService";
import { MessageIcon, MicIcon } from "./icons";

type InteractionMode = "chat" | "voice";

const ChatHeader: React.FC = () => {
  return (
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
    </div>
  );
};

export const InteractivePanel: React.FC<{ mode: InteractionMode }> = ({ mode }) => {
  const {
    messages,
    addMessage,
    setLastMessageContent,
    setIsLoading,
  } = useChatStore();
  const { setEmotion } = useAvatarStore();
  const { user } = useAuth();

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: Sender.User,
    };

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
        fullResponse = "I'm a little lost for words... Can we try that again?";
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
  };

  return (
    <ChatPanel header={<ChatHeader />}>
      {mode === "chat" ? (
        <>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
            <MessageList onSendMessage={handleSendMessage} />
          </div>
          <div className="p-4 md:p-6 border-t border-border flex-shrink-0">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </>
      ) : (
        <VoiceChatPanel isOpen={true} onClose={() => {}} />
      )}
    </ChatPanel>
  );
};
