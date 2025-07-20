import React from "react";

const Loader: React.FC = () => {
  // Changed the loading text to "RIYA" to match your brand
  const loadingText = "RIYA";
  const cubeLetters = loadingText.split("");

  // Define CSS variables with your brand colors
  const wrapperStyle = {
    "--animation-duration": "2.1s",
    "--cube-color": "rgba(255, 241, 240, 0.1)", // Light pink background
    "--highlight-color": "#FF5D8F", // Your primary pink color
    "--accent-color": "#8ECAE6", // Your accent blue color
    "--cube-width": "64px", // Larger cubes for better visibility
    "--cube-height": "64px",
    "--font-size": "2.2em", // Larger font size
  } as React.CSSProperties;

  return (
    // Updated background to match your website's style
    <div
      className="flex items-center justify-center min-h-screen w-full relative"
      style={{
        background: "linear-gradient(135deg, #FFF1F0 0%, #FFD6E0 100%)",
        backgroundImage:
          "linear-gradient(to right, rgba(255, 93, 143, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 93, 143, 0.05) 1px, transparent 1px)",
        backgroundSize: "6rem 4rem",
      }}
    >
      {/* Add a subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-pink-200/20 via-transparent to-transparent"></div>
      {/* All custom CSS for the loader is embedded here */}
      <style>
        {`
          /* From Uiverse.io by dexter-st */
          /* Base styles for the grid container */
          .wrapper-grid {
            position: relative;
            inset: 0; /* Equivalent to top:0; right:0; bottom:0; left:0; */
            display: grid;
            /* Adjusted grid-template-columns based on the new length of loadingText */
            grid-template-columns: repeat(${cubeLetters.length}, var(--cube-width));
            grid-template-rows: auto;
            gap: 0; /* No gap between grid items */
            width: calc(${cubeLetters.length} * var(--cube-width));
            height: var(--cube-height);
            perspective: 350px; /* Adds 3D perspective to child elements */
            font-family: "Poppins", sans-serif;
            font-size: var(--font-size);
            font-weight: 800;
            color: transparent; /* Default text color, will be animated */
          }

          /* Styles for each individual cube */
          .cube {
            position: relative;
            transform-style: preserve-3d; /* Ensures children are positioned in 3D space */
            animation: translate-z var(--animation-duration) ease-in-out infinite;
          }

          /* Styles for each face of the cube */
          .face {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--cube-width);
            height: var(--cube-height);
            background-color: var(--cube-color);
            border-radius: 8px; /* Rounded corners for modern look */
            font-weight: 900; /* Bold font weight */
            animation: face-color var(--animation-duration) ease-in-out infinite, edge-glow var(--animation-duration) ease-in-out infinite;
            animation-delay: inherit;
          }

          /* Box shadows for specific faces with pink theme */
          .face-left,
          .face-right,
          .face-back,
          .face-front {
            box-shadow: 0 4px 15px rgba(255, 93, 143, 0.2), inset 0 0 12px 1px rgba(255, 255, 255, 0.1);
          }

          /* Specific transformations for each face to form a cube */
          .face-front {
            transform: rotateY(0deg) translateZ(calc(var(--cube-width) / 2));
            background: linear-gradient(135deg, rgba(255, 93, 143, 0.1), rgba(142, 202, 230, 0.1));
            animation: face-color var(--animation-duration) ease-in-out infinite, face-glow var(--animation-duration) ease-in-out infinite, edge-glow var(--animation-duration) ease-in-out infinite;
            animation-delay: inherit;
          }

          .face-back {
            transform: rotateY(180deg) translateZ(calc(var(--cube-width) / 2));
            opacity: 0.6;
          }

          .face-left {
            transform: rotateY(-90deg) translateZ(calc(var(--cube-width) / 2));
            opacity: 0.6;
          }

          .face-right {
            transform: rotateY(90deg) translateZ(calc(var(--cube-width) / 2));
            opacity: 0.6;
          }

          .face-top {
            height: var(--cube-width);
            transform: rotateX(90deg) translateZ(calc(var(--cube-width) / 2));
            opacity: 0.8;
          }

          .face-bottom {
            height: var(--cube-width);
            transform: rotateX(-90deg) translateZ(calc(var(--cube-height) - var(--cube-width) * 0.5));
            opacity: 0.8;
          }

          /* Staggered animation delays and z-index for each cube (4 letters for RIYA) */
          .cube:nth-child(1) { z-index: 0; animation-delay: 0s; }
          .cube:nth-child(2) { z-index: 1; animation-delay: 0.3s; }
          .cube:nth-child(3) { z-index: 2; animation-delay: 0.6s; }
          .cube:nth-child(4) { z-index: 1; animation-delay: 0.9s; }

          /* Keyframe animations */
          @keyframes translate-z {
            0%, 40%, 100% {
              transform: translateZ(-2px);
            }
            30% {
              transform: translateZ(16px) translateY(-1px);
            }
          }

          @keyframes face-color {
            0%, 50%, 100% {
              background: linear-gradient(135deg, rgba(255, 93, 143, 0.1), rgba(142, 202, 230, 0.1));
            }
            25% {
              background: linear-gradient(135deg, var(--highlight-color), var(--accent-color));
            }
          }

          @keyframes face-glow {
            0%, 50%, 100% {
              color: rgba(255, 93, 143, 0.7);
              filter: none;
            }
            25% {
              color: #fff;
              filter: drop-shadow(0 8px 16px var(--highlight-color)) drop-shadow(0 0 20px var(--accent-color));
            }
          }

          @keyframes edge-glow {
            0%, 40%, 100% {
              box-shadow: 0 4px 15px rgba(255, 93, 143, 0.2), inset 0 0 12px 1px rgba(255, 255, 255, 0.1);
            }
            25% {
              box-shadow: 0 0 30px 5px var(--highlight-color), 0 0 50px 10px var(--accent-color);
            }
          }
        `}
      </style>

      {/* The main container for the loader */}
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="wrapper-grid" style={wrapperStyle}>
          {cubeLetters.map((letter, index) => (
            <div className="cube" key={index}>
              <div className="face face-front">{letter}</div>
              <div className="face face-back"></div>
              <div className="face face-right"></div>
              <div className="face face-left"></div>
              <div className="face face-top"></div>
              <div className="face face-bottom"></div>
            </div>
          ))}
        </div>

        {/* Loading message */}
        <div className="text-center">
          <p className="text-lg font-semibold text-primary mb-2">
            Loading your AI companion...
          </p>
          <div className="flex items-center justify-center gap-1">
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary-accent rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
