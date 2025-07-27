import React from "react";
import { PixelImage } from "@/components/magicui/pixel-image";
import { Mic, MessageCircle } from "lucide-react";

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
              <MessageCircle className="w-5 h-5" />
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
              <Mic className="w-5 h-5" />
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
              <MessageCircle className="w-4 h-4" />
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
              <Mic className="w-4 h-4" />
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
