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
        <div className="w-full max-w-xs mx-auto aspect-[3/4] flex items-center justify-center rounded-3xl border-4 border-white shadow-2xl bg-white/80">
          {/* Pixelated Riya Avatar */}
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
  );
};
