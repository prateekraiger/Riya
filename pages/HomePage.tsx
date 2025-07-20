import React from "react";
import { HeroDemo } from "@/components/blocks/hero-demo";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

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

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* White grid background for the whole page */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] pointer-events-none" />
      <div className="relative z-10">
        <HeroDemo />
        <MarqueeDemo />
      </div>
    </div>
  );
};

export default HomePage;
