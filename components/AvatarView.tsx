import React from "react";
import { PixelImage } from "@/components/magicui/pixel-image";

export const AvatarView: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
      <div className="w-full flex flex-col items-center justify-center">
        {/* <div className="flex items-center justify-center gap-2 text-sm text-green-400 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Online
        </div> */}
        <div className="w-full max-w-lg min-h-[500px] mx-auto aspect-[3/4] flex items-center justify-center relative rounded-3xl">
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: "0 0 40px 10px #8ECAE6, 0 0 80px 20px #FF5D8F",
            }}
          />
          {/* Pixelated Riya Avatar */}
          <div className="w-full h-full rounded-3xl overflow-hidden relative z-10 bg-white/80 border-4 border-white shadow-2xl flex items-center justify-center">
            <PixelImage
              src="/assets/riya1.png"
              customGrid={{ rows: 12, cols: 8 }}
              grayscaleAnimation={false}
              pixelFadeInDuration={600}
              maxAnimationDelay={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
