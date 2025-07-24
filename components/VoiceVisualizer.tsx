import React, { useEffect, useRef } from "react";

interface VoiceVisualizerProps {
  audioLevel: number;
  isActive: boolean;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  audioLevel,
  isActive,
  className = "",
}) => {
  const visualizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visualizerRef.current && isActive) {
      // Scale based on audio level (0-1) with a minimum base scale
      const scale = 1 + audioLevel * 0.5;
      visualizerRef.current.style.transform = `scale(${scale})`;
    } else if (visualizerRef.current && !isActive) {
      visualizerRef.current.style.transform = "scale(1)";
    }
  }, [audioLevel, isActive]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer glow ring */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-primary/30 to-primary-dark/30 animate-pulse"
            : "bg-primary/10"
        }`}
        style={{
          filter: "blur(8px)",
          transform: isActive ? "scale(1.2)" : "scale(1)",
        }}
      />

      {/* Main visualizer circle */}
      <div
        ref={visualizerRef}
        className={`relative w-16 h-16 rounded-full transition-all duration-100 ease-out ${
          isActive
            ? "bg-gradient-to-r from-primary to-primary-dark shadow-lg shadow-primary/50"
            : "bg-gradient-to-r from-primary/60 to-primary-dark/60"
        }`}
        style={{
          willChange: "transform",
        }}
      >
        {/* Inner pulse effect */}
        <div
          className={`absolute inset-2 rounded-full transition-all duration-200 ${
            isActive ? "bg-white/20 animate-pulse" : "bg-white/10"
          }`}
        />

        {/* Center dot */}
        <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
      </div>

      {/* Audio level bars around the circle */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-primary rounded-full transition-all duration-100"
              style={{
                height: `${8 + audioLevel * 20}px`,
                transform: `rotate(${i * 45}deg) translateY(-32px)`,
                opacity: 0.6 + audioLevel * 0.4,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
