import { HeroWithMockup } from "@/components/ui/hero-with-mockup";
import { ComicText } from "@/components/magicui/comic-text";
import TypingAnimation from "@/components/magicui/typing-animation";
import React from "react";

export function HeroDemo() {
  return (
    <HeroWithMockup
      customTitle={
        <div className="flex flex-col items-center justify-center gap-6">
          <ComicText fontSize={7} className="mb-2">
            RIYA
          </ComicText>
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            <TypingAnimation
              typingSpeed={80}
              startDelay={800}
              className="tracking-wide"
            >
              Your Ai Companion
            </TypingAnimation>
          </div>
        </div>
      }
      description="Experience a new kind of Friendship. Riya is always here to chat, listen, and brighten your day with empathy and intelligence."
      primaryCta={{
        text: "Start Chatting",
        href: "/chat",
      }}
      secondaryCta={{
        text: "View on GitHub",
        href: "https://github.com/prateekraiger/Riya",
      }}
      mockupImage={{
        alt: "Riya AI Chat Dashboard",
        width: 1248,
        height: 765,
        src: "https://ik.imagekit.io/mtk2a0sx6/riya_preview.png",
      }}
    />
  );
}
