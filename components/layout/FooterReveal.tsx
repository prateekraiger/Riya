import React, { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/ui/footer";
import { Github, Twitter } from "lucide-react";

const footerConfig = {
  logo: (
    <img src="/logo.png" alt="Riya Logo" className="h-10 w-10 rounded-full" />
  ),
  brandName: "RIYa Your AI Companion",
  socialLinks: [
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://x.com/mrpratik753",
      label: "Twitter",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/prateekraiger/Riya",
      label: "GitHub",
    },
  ],
  mainLinks: [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ],
  legalLinks: [],
  copyright: {
    text: "2025 RIYA Your AI GF. All rights reserved.",
    license: "",
  },
  description:
    "RIYa is your caring, always-there AI companion. Chat, connect, and experience a new kind of friendship—anytime, anywhere.",
};

const FooterReveal: React.FC = () => {
  const [showFooter, setShowFooter] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShowFooter(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="w-full h-1" />
      {showFooter && (
        <footer className="pb-6 pt-12 lg:pb-8 lg:pt-16 w-full bg-white">
          <div className="px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              {/* Left: Logo and description */}
              <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-auto md:max-w-xs">
                <a
                  href="/"
                  className="flex items-center gap-x-2"
                  aria-label={footerConfig.brandName}
                >
                  {footerConfig.logo}
                  <span
                    className="font-bold text-xl text-primary-dark"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    {footerConfig.brandName}
                  </span>
                </a>
                <span className="text-lg text-muted-foreground text-center md:text-left max-w-xs">
                  {footerConfig.description}
                </span>
              </div>
              {/* Right: Main links, then social icons below */}
              <div className="flex flex-col items-center md:items-end w-full md:w-auto gap-2">
                <nav>
                  <ul className="flex flex-row gap-4 md:gap-6 justify-center md:justify-end mb-2">
                    {footerConfig.mainLinks.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.href}
                          className="text-lg text-primary underline-offset-4 hover:underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <ul className="flex list-none space-x-3 justify-center md:justify-end w-full md:w-auto mt-2">
                  {footerConfig.socialLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        target="_blank"
                        aria-label={link.label}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
                      >
                        {link.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 flex flex-col items-center">
              <div className="text-lg leading-7 text-muted-foreground whitespace-nowrap text-center">
                {footerConfig.copyright.text}
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default FooterReveal;
