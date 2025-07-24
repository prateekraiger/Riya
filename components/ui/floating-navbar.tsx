"use client";
import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
  alwaysVisible = false,
  user,
  onLogout,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactElement;
  }[];
  className?: string;
  alwaysVisible?: boolean;
  user?: any;
  onLogout?: () => void;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }
    const handler = (current: number) => {
      let direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    };
    useMotionValueEvent(scrollYProgress, "change", handler);
    return () => {
      // Cleanup function
    };
    // eslint-disable-next-line
  }, [alwaysVisible]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-2 inset-x-0 mx-auto border border-border rounded-full bg-background/95 shadow-2xl z-[5000] pr-4 pl-6 py-2 items-center justify-center space-x-4 backdrop-blur-xl",
          className
        )}
      >
        {/* RIYA Logo and Heading */}
        <a href="/" className="flex items-center gap-2 select-none">
          <img
            src="/logo.png"
            alt="RIYA Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark text-lg sm:text-xl md:text-2xl tracking-tight">
            RIYA
          </span>
        </a>
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative items-center flex space-x-1 text-foreground font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:bg-primary/15 hover:text-primary-dark focus:bg-primary/20 focus:text-primary-dark text-lg tracking-wide shadow-sm",
              "hover:shadow-primary/20"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span
              className="hidden sm:block text-lg font-bold"
              style={{ letterSpacing: "0.01em" }}
            >
              {navItem.name}
            </span>
          </a>
        ))}
        {user ? (
          <button
            className="border-2 border-primary text-primary font-semibold px-6 py-2 rounded-full ml-2 bg-white/80 hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-200 shadow-sm text-lg tracking-wide"
            onClick={onLogout}
          >
            <span>Logout</span>
          </button>
        ) : (
          <a
            href="/login"
            className="border-2 border-primary text-primary font-semibold px-6 py-2 rounded-full ml-2 bg-white/80 hover:bg-primary hover:text-white hover:shadow-lg transition-all duration-200 shadow-sm text-lg tracking-wide"
          >
            <span>Login</span>
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
