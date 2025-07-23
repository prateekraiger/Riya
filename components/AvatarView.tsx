import React from "react";
import { PixelImage } from "@/components/magicui/pixel-image";

export const AvatarView: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent p-0 sm:p-8">
      {/* Desktop & Tablet Layout */}
      <div className="hidden sm:block w-full mt-2">
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
      <div className="block sm:hidden w-full mt-8">
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
