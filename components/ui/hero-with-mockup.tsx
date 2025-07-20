import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { Github } from "lucide-react";

interface HeroWithMockupProps {
  title?: string;
  customTitle?: React.ReactNode;
  description: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  mockupImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
}

export function HeroWithMockup({
  title,
  customTitle,
  description,
  primaryCta = {
    text: "Get Started",
    href: "/get-started",
  },
  secondaryCta = {
    text: "GitHub",
    href: "https://github.com/your-repo",
    icon: <Github className="mr-2 h-4 w-4" />,
  },
  mockupImage,
  className,
}: HeroWithMockupProps) {
  return (
    <section
      className={cn(
        "relative text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className
      )}
    >
      {/* Exact grid pattern background as requested, now with z-0 */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      {/* Pink radial overlay remains for accent, now with z-0 */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[60vw] w-[60vw] max-w-[900px] max-h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,93,143,0.18)_0%,_rgba(255,93,143,0)_70%)]" />
      </div>
      <div className="relative mx-auto max-w-[1280px] flex flex-col gap-12 lg:gap-24">
        <div className="relative z-10 flex flex-col items-center gap-6 pt-8 md:pt-16 text-center lg:gap-12">
          {/* Heading */}
          {customTitle ? (
            <div className="animate-appear">{customTitle}</div>
          ) : (
            <h1
              className={cn(
                "inline-block animate-appear",
                "bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground",
                "bg-clip-text text-transparent",
                "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
                "leading-[1.1] sm:leading-[1.1]",
                "drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              )}
            >
              {title}
            </h1>
          )}

          {/* Description */}
          <p
            className={cn(
              "max-w-[550px] animate-appear opacity-0 [animation-delay:150ms]",
              "text-base sm:text-lg md:text-xl",
              "text-muted-foreground",
              "font-medium"
            )}
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className="relative z-10 flex flex-wrap justify-center gap-4
            animate-appear opacity-0 [animation-delay:300ms]"
          >
            {/* Animated Gradient Button for Primary CTA */}
            <a
              href={primaryCta.href}
              className="transition-background inline-flex h-12 items-center justify-center rounded-md border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              {primaryCta.text}
            </a>
            {/* Animated Gradient Button for Secondary CTA */}
            <a
              href={secondaryCta.href}
              className="transition-background inline-flex h-12 items-center justify-center rounded-md border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              {secondaryCta.icon}
              {secondaryCta.text}
            </a>
          </div>

          {/* Mockup with enhanced colorful glow effect */}
          <div className="relative w-full pt-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-2xl blur-3xl opacity-80 bg-[radial-gradient(ellipse_at_center,_rgba(255,93,143,0.45)_0%,_rgba(142,202,230,0.25)_60%,_rgba(255,93,143,0)_100%)]" />
              <Mockup
                className={cn(
                  "animate-appear opacity-0 [animation-delay:700ms]",
                  "shadow-[0_0_50px_-12px_rgba(255,93,143,0.25)] dark:shadow-[0_0_50px_-12px_rgba(142,202,230,0.15)]",
                  "border-brand/10 dark:border-brand/5"
                )}
              >
                <img
                  {...mockupImage}
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </Mockup>
            </div>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow
          variant="above"
          className="animate-appear-zoom opacity-0 [animation-delay:1000ms]"
        />
      </div>
    </section>
  );
}
