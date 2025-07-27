import React, { useEffect, useRef, useState, useCallback } from "react";

interface VoiceVisualizerProps {
  /**
   * The current audio level, a value between 0 and 1.
   * This controls the scale of the main circle and the intensity/frequency of the ripples.
   */
  audioLevel: number;
  /**
   * Determines if the visualizer is active, triggering animations and dynamic effects.
   */
  isActive: boolean;
  /**
   * Optional additional Tailwind CSS classes to apply to the main container div.
   */
  className?: string;
}

interface Ripple {
  id: number;
  initialScale: number;
  duration: number;
  delay: number;
  opacity: number;
}

/**
 * A visually appealing voice activity visualizer component.
 * It displays a pulsating circle with dynamic ripple effects indicating audio level.
 */
export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  audioLevel,
  isActive,
  className = "",
}) => {
  const visualizerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to scale the main visualizer circle based on audio level
  useEffect(() => {
    if (visualizerRef.current) {
      if (isActive) {
        // Scale based on audio level (0-1) with a minimum base scale
        const scale = 1 + audioLevel * 0.2; // Slightly more subtle scaling
        visualizerRef.current.style.transform = `scale(${scale})`;
      } else {
        // Reset scale when inactive
        visualizerRef.current.style.transform = "scale(1)";
      }
    }
  }, [audioLevel, isActive]);

  // Function to add a new ripple
  const addRipple = useCallback(() => {
    const newRipple: Ripple = {
      id: nextRippleId.current++,
      initialScale: 0.5,
      duration: 1.5 + (1 - audioLevel) * 0.5, // Faster for higher audio
      delay: 0, // No initial delay for the ripple itself
      opacity: 0.4 + audioLevel * 0.4, // More opaque for higher audio
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    // Remove ripple after its animation duration
    setTimeout(() => {
      setRipples((prevRipples) =>
        prevRipples.filter((r) => r.id !== newRipple.id)
      );
    }, newRipple.duration * 1000 + 100); // Add a small buffer
  }, [audioLevel]);

  // Effect to manage ripple generation based on audio level and activity
  useEffect(() => {
    if (rippleTimeoutRef.current) {
      clearTimeout(rippleTimeoutRef.current);
    }

    if (isActive && audioLevel > 0.05) {
      // Only trigger if active and there's significant audio
      const triggerDelay = Math.max(100, 600 - audioLevel * 500); // Faster triggers for higher audio
      rippleTimeoutRef.current = setTimeout(() => {
        addRipple();
      }, triggerDelay);
    }

    return () => {
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, [audioLevel, isActive, addRipple]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer glow ring - provides a soft, pulsating aura */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ease-out ${
          isActive ? "animate-glow-pulse" : "bg-pink-100/10"
        }`}
        style={{
          background: isActive
            ? "linear-gradient(to right, var(--color-pink-300), var(--color-pink-700))"
            : "var(--color-pink-100)",
          filter: "blur(12px)", // Increased blur for a softer glow
          transform: isActive ? "scale(1.2)" : "scale(1)", // Slight scale on activation
          opacity: isActive ? 0.7 : 0.3, // Opacity adjustment for glow
        }}
      />

      {/* Main visualizer circle - the core element that scales */}
      <div
        ref={visualizerRef}
        className={`relative w-16 h-16 rounded-full transition-all duration-100 ease-out ${
          isActive
            ? "bg-gradient-to-r from-pink-500 to-pink-700 shadow-lg shadow-pink-500/50"
            : "bg-gradient-to-r from-pink-400/60 to-pink-600/60"
        }`}
        style={{
          willChange: "transform",
          background: isActive
            ? "linear-gradient(to right, var(--color-pink-500), var(--color-pink-800))"
            : "linear-gradient(to right, var(--color-pink-400), var(--color-pink-700))",
          boxShadow: isActive
            ? "0 10px 15px -3px rgba(var(--color-pink-rgb), 0.5), 0 4px 6px -2px rgba(var(--color-pink-rgb), 0.05)"
            : "none",
        }}
      >
        {/* Inner pulse effect - a subtle, rhythmic animation inside the circle */}
        <div
          className={`absolute inset-2 rounded-full transition-all duration-200 ${
            isActive ? "bg-white/20 animate-inner-pulse" : "bg-white/10"
          }`}
        />

        {/* Center dot - a small static indicator */}
        <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
      </div>

      {/* Ripple effects - dynamically created and animated */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute inset-0 rounded-full bg-pink-300/30 animate-ripple-out"
          style={{
            background: `rgba(var(--color-pink-rgb), ${ripple.opacity})`,
            animationDuration: `${ripple.duration}s`,
            animationDelay: `${ripple.delay}s`,
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
            transform: `scale(${ripple.initialScale})`,
          }}
        />
      ))}

      {/* Define custom keyframe animations and CSS variables for a smoother effect */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1.2);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.25);
          }
        }

        @keyframes inner-pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes ripple-out {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5); /* Expand beyond the container */
            opacity: 0;
          }
        }

        .animate-glow-pulse {
          animation: glow-pulse 2s infinite ease-in-out;
        }

        .animate-inner-pulse {
          animation: inner-pulse 1.5s infinite ease-in-out;
        }

        .animate-ripple-out {
          animation-name: ripple-out;
          animation-iteration-count: 1;
        }

        /* Define soft pink colors as CSS variables for easy theming */
        :root {
          --color-pink-100: #fce7f3; /* Very light pink */
          --color-pink-300: #fbcfe8; /* Light pink */
          --color-pink-400: #f9a8d4; /* Medium light pink */
          --color-pink-500: #f472b6; /* Primary pink */
          --color-pink-600: #ec4899; /* Medium pink */
          --color-pink-700: #db2777; /* Darker pink */
          --color-pink-800: #be185d; /* Even darker pink */
          --color-pink-rgb: 244, 114, 182; /* RGB for shadow */
        }

        /* Tailwind's 'primary' and 'primary-dark' would map to these in your config */
        .bg-primary { background-color: var(--color-pink-500); }
        .to-primary-dark { --tw-gradient-to: var(--color-pink-700); }
        .from-primary { --tw-gradient-from: var(--color-pink-500); }
        .shadow-primary\\/50 { --tw-shadow-color: rgba(var(--color-pink-rgb), 0.5); }
      `}</style>
    </div>
  );
};
