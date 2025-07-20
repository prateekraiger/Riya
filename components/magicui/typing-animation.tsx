import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingAnimationProps {
  children: string;
  className?: string;
  typingSpeed?: number;
  cursorBlinkSpeed?: number;
  startDelay?: number;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  children,
  className = "",
  typingSpeed = 100,
  cursorBlinkSpeed = 500,
  startDelay = 300,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const text = children.toString();

  // Typing effect
  useEffect(() => {
    let currentIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const startTyping = () => {
      typingTimer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingTimer);
          setIsTypingComplete(true);
        }
      }, typingSpeed);
    };

    const delayTimer = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(typingTimer);
    };
  }, [text, typingSpeed, startDelay]);

  // Cursor blinking effect
  useEffect(() => {
    if (!isTypingComplete) return;

    const cursorTimer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(cursorTimer);
  }, [isTypingComplete, cursorBlinkSpeed]);

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
      <span
        className="text-primary font-bold"
        style={{ opacity: cursorVisible ? 1 : 0 }}
      >
        |
      </span>
    </motion.span>
  );
};

export default TypingAnimation;
