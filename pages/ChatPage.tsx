import React, { useCallback, useEffect, useState } from "react";
import { AvatarView } from "../components/AvatarView";
import { InteractivePanel } from "../components/InteractivePanel";
import { useChatStore } from "../store/useChatStore";
import { useAvatarStore } from "../store/useAvatarStore";
import { getChatHistory } from "../database/supabase";
import { useAuth } from "../hooks/useAuth";

type InteractionMode = "chat" | "voice";

const ChatPage: React.FC = () => {
  const [mode, setMode] = useState<InteractionMode>("chat");
  const { setMessages, setIsLoading } = useChatStore();
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

  return (
    <div className="flex flex-1 flex-col md:flex-row w-full h-full font-sans text-foreground relative overflow-hidden pt-8">
      {/* Avatar Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 md:p-8 min-h-[50vh] md:min-h-full relative">
        <div className="relative z-10">
          <AvatarView mode={mode} setMode={setMode} />
        </div>
      </div>
      {/* Chat Section */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col min-h-[50vh] md:min-h-full relative pb-16">
        <InteractivePanel mode={mode} />
      </div>
    </div>
  );
};

export default ChatPage;
