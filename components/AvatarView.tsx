import React from "react";
import { PixelImage } from "@/components/magicui/pixel-image";

export const AvatarView: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent -mx-5 px-5">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-[calc(100vw-0px)] sm:w-full sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl min-h-[180px] xs:min-h-[220px] sm:min-h-[280px] md:min-h-[350px] lg:min-h-[500px] aspect-[3/4] flex items-center justify-center relative rounded-3xl mt-8 sm:mt-0">
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: "0 0 120px 40px #FF5D8F, 0 0 240px 80px #FF5D8F",
            }}
          />
          {/* Pixelated Riya Avatar Container */}
          <div className="w-full h-full rounded-3xl overflow-hidden relative z-10 flex items-center justify-center">
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
