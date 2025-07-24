import React from "react";
import { VoiceChatPanel } from "./VoiceChatPanel";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

type InteractionMode = "chat" | "voice";

export const InteractivePanel: React.FC<{
  mode: InteractionMode;
  handleSendMessage: (text: string) => Promise<void>;
}> = ({ mode, handleSendMessage }) => {
  return (
    <div className="w-full h-full flex-1">
      {mode === "chat" && (
        <div className="flex flex-col h-full animate-fadein">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-0">
            <MessageList onSendMessage={handleSendMessage} />
          </div>
          <div className="p-4 md:p-6 border-t border-border flex-shrink-0">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
      {mode === "voice" && (
        <div className="flex flex-col h-full animate-fadein">
          <VoiceChatPanel isOpen={true} onClose={() => {}} />
        </div>
      )}
      <style>{`
        .animate-fadein {
          animation: fadein 0.5s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};
