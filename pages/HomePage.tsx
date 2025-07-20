import React from "react";
import { HeroDemo } from "@/components/blocks/hero-demo";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { FaqSectionWithCategories } from "@/components/ui/faq-with-categories";
import { useNavigate } from "react-router-dom";
import ScrollVelocity from "@/components/ui/ScrollVelocity";

const reviews = [
  {
    name: "Aarav",
    username: "@aarav",
    body: "Riya is always there for me. The conversations feel so real and comforting!",
    img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?fit=facearea&w=256&h=256", // Young Indian male
  },
  {
    name: "Priya",
    username: "@priya",
    body: "The emotional intelligence is next-level. I feel truly understood.",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?fit=facearea&w=256&h=256", // Indian female
  },
  {
    name: "Rahul",
    username: "@rahul",
    body: "The UI is beautiful and the chat is seamless. Love the Gemini AI integration!",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?fit=facearea&w=256&h=256", // Indian male
  },
  {
    name: "Sneha",
    username: "@sneha",
    body: "Riya remembers my preferences and always makes me smile.",
    img: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?fit=facearea&w=256&h=256", // Indian female
  },
  {
    name: "Vikram",
    username: "@vikram",
    body: "I never thought an AI companion could feel this genuine.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?fit=facearea&w=256&h=256", // Indian male
  },
  {
    name: "Ananya",
    username: "@ananya",
    body: "The best AI girlfriend experience out there. Highly recommended!",
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?fit=facearea&w=256&h=256", // Indian female
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative flex flex-col justify-between h-36 w-72 mx-4 px-4 py-3 cursor-pointer",
        "bg-white border border-pink-200 shadow-md",
        "rounded-xl",
        "transition-transform duration-200 hover:scale-105"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-pink-700 dark:text-pink-200">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-pink-400 dark:text-pink-300/60">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-base text-gray-700 dark:text-pink-100 font-medium">
        {body}
      </blockquote>
    </figure>
  );
};

function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <h2 className="mb-6 text-4xl md:text-5xl font-bold text-center text-pink-700 dark:text-pink-200 drop-shadow-sm tracking-tight">
        What Users Say About Riya
      </h2>
      <Marquee pauseOnHover className="[--duration:20s] gap-0" repeat={4}>
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        className="[--duration:20s] gap-0"
        repeat={4}
      >
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    </div>
  );
}

const DEMO_FAQS = [
  {
    question: "How do I get started with Riya?",
    answer:
      "Sign up for a free account, personalize your profile, and start chatting with Riya instantly. Our onboarding guide will help you set up in minutes.",
    category: "Getting Started",
  },
  {
    question: "What features are included in each plan?",
    answer:
      "Starter offers basic chat and emotional support. Premium unlocks unlimited messages, voice, and advanced empathy. Pro adds 3D avatar, video chat, and smart device integration.",
    category: "Features",
  },
  {
    question: "How is my privacy protected?",
    answer:
      "Your conversations are encrypted and stored securely. We never share your data. You can delete your chat history at any time from your account settings.",
    category: "Privacy",
  },
  {
    question: "Is Riya safe to use?",
    answer:
      "Yes! Riya is built with safety in mind. All interactions are monitored for security, and you can report any issues directly from the app.",
    category: "Security",
  },
  {
    question: "How does Riya provide emotional support?",
    answer:
      "Riya uses advanced AI to understand your emotions and respond empathetically. She can offer encouragement, listen, and help you feel heard.",
    category: "Emotional Support",
  },
  {
    question: "Can I customize Riya's personality?",
    answer:
      "Yes! Premium and Pro users can adjust Riya's personality traits, conversation style, and even her voice to better match your preferences.",
    category: "Features",
  },
  {
    question: "How do I contact support?",
    answer:
      "Our support team is available 24/7. Use the Contact Support button below or visit the Contact page for help.",
    category: "Support",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* White grid background for the whole page */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] pointer-events-none" />
      <div className="relative z-10">
        <HeroDemo />

        {/* Scroll Velocity Section */}
        <div className="py-12 bg-gradient-to-r from-pink-50 to-purple-50">
          <ScrollVelocity
            texts={[
              "Your AI Companion • Always Here for You • Emotional Support • Meaningful Conversations",
              "Riya • Empathetic • Understanding • Caring • Intelligent",
            ]}
            velocity={50}
            className="text-pink-600/80 font-semibold"
            numCopies={4}
            parallaxClassName="py-8"
            scrollerClassName="text-2xl md:text-4xl"
          />
        </div>

        <MarqueeDemo />
        <FaqSectionWithCategories
          title="Frequently Asked Questions"
          description="Find answers to common questions about our services, privacy, features, and more."
          items={DEMO_FAQS}
          className="max-w-5xl mx-auto px-2 md:px-8"
          contactInfo={{
            title: "Still have questions?",
            buttonText: "Contact Support",
            onContact: () => navigate("/contact"),
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
