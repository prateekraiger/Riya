import React from "react";
import { PixelImage } from "@/components/magicui/pixel-image";

interface AvatarViewProps {
  mode?: "chat" | "voice";
  onModeChange?: (mode: "chat" | "voice") => void;
}

export const AvatarView: React.FC<AvatarViewProps> = ({
  mode = "chat",
  onModeChange,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-0 sm:p-8 relative">
      {/* Mode Toggle Above Image - Desktop */}
      {onModeChange && (
        <div className="hidden sm:flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-primary/20">
            <button
              onClick={() => onModeChange("chat")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                mode === "chat"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to text chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Chat</span>
            </button>
            <button
              onClick={() => onModeChange("voice")}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                mode === "voice"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to voice chat"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span>Voice</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Toggle Above Image - Mobile */}
      {onModeChange && (
        <div className="flex sm:hidden items-center justify-center mb-6">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-primary/20">
            <button
              onClick={() => onModeChange("chat")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                mode === "chat"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to text chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Chat</span>
            </button>
            <button
              onClick={() => onModeChange("voice")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                mode === "voice"
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transform scale-105"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              }`}
              title="Switch to voice chat"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span>Voice</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop & Tablet Layout */}
      <div className="hidden sm:block w-full">
        <div className="relative w-[360px] md:w-[420px] lg:w-[500px] aspect-[3/4] mx-auto">
          {/* Soft Glow */}
          <div className="absolute inset-0 bg-pink-400/20 rounded-3xl blur-3xl scale-110"></div>
          {/* Radial Pink Glow */}
          <div
            className="absolute inset-0 rounded-[2rem] blur-2xl opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 93, 143, 0.3) 0%, rgba(255, 93, 143, 0.1) 50%, transparent 70%)",
            }}
          ></div>
          {/* Extra Glow for Desktop */}
          <div
            className="absolute inset-0 rounded-[2rem] blur-3xl opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 93, 143, 0.22) 0%, rgba(255, 93, 143, 0.08) 55%, transparent 80%)",
            }}
          ></div>
          {/* Main Frame */}
          <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl border-4 border-white overflow-hidden">
            {/* Image Area */}
            <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-pink-50/30">
              <div
                className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
                style={{
                  boxShadow: "0 0 60px 20px #FF5D8F, 0 0 120px 40px #FF5D8F",
                }}
              ></div>
              <PixelImage
                src="/assets/riya1.png"
                customGrid={{ rows: 10, cols: 8 }}
                grayscaleAnimation={true}
                pixelFadeInDuration={600}
                maxAnimationDelay={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden w-full">
        <div className="relative w-[90vw] max-w-[340px] aspect-[3/4] mx-auto">
          {/* Soft Glow */}
          <div className="absolute inset-0 bg-pink-400/20 rounded-3xl blur-2xl scale-110"></div>
          {/* Radial Pink Glow */}
          <div
            className="absolute inset-0 rounded-[2rem] blur-xl opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255, 93, 143, 0.25) 0%, rgba(255, 93, 143, 0.08) 55%, transparent 80%)",
            }}
          ></div>
          {/* Main Frame */}
          <div className="relative w-full h-full bg-white rounded-3xl shadow-xl border-2 border-white overflow-hidden">
            {/* Image Area */}
            <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-br from-slate-50 to-pink-50/30">
              <div
                className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
                style={{
                  boxShadow: "0 0 40px 12px #FF5D8F, 0 0 80px 24px #FF5D8F",
                }}
              ></div>
              <PixelImage
                src="/assets/riya1.png"
                customGrid={{ rows: 10, cols: 8 }}
                grayscaleAnimation={true}
                pixelFadeInDuration={600}
                maxAnimationDelay={400}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
