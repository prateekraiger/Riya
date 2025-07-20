import { HeroWithMockup } from "@/components/ui/hero-with-mockup";

export function HeroDemo() {
  return (
    <HeroWithMockup
      title="Meet Riya: Your AI Girlfriend"
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
