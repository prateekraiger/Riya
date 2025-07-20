import React from "react";

const Loader: React.FC = () => {
  // Changed the loading text back to "LOADING" as requested
  const loadingText = "LOADING";
  const cubeLetters = loadingText.split("");

  // Define CSS variables as inline style for the wrapper-grid.
  // These variables are then used by the embedded CSS rules.
  const wrapperStyle = {
    "--animation-duration": "2.1s",
    "--cube-color": "transparent", // Using transparent for background-color initially as per original
    "--highlight-color": "#00cc44",
    "--cube-width": "48px",
    "--cube-height": "48px",
    "--font-size": "1.8em",
  } as React.CSSProperties; // Type assertion for custom CSS properties

  return (
    // Added Tailwind CSS classes to center the loader on the page
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900">
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
            background-color: var(--cube-color); /* Initial background color */
            animation: face-color var(--animation-duration) ease-in-out infinite, edge-glow var(--animation-duration) ease-in-out infinite;
            animation-delay: inherit; /* Inherits animation-delay from parent .cube */
          }

          /* Box shadows for specific faces */
          .face-left,
          .face-right,
          .face-back,
          .face-front {
            box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.06), inset 0 0 12px 1px rgba(255, 255, 255, 0.06);
          }

          /* Specific transformations for each face to form a cube */
          .face-front {
            transform: rotateY(0deg) translateZ(calc(var(--cube-width) / 2));
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

          /* Staggered animation delays and z-index for each cube */
          .cube:nth-child(1) { z-index: 0; animation-delay: 0s; }
          .cube:nth-child(2) { z-index: 1; animation-delay: 0.2s; }
          .cube:nth-child(3) { z-index: 2; animation-delay: 0.4s; }
          .cube:nth-child(4) { z-index: 3; animation-delay: 0.6s; }
          .cube:nth-child(5) { z-index: 2; animation-delay: 0.8s; }
          .cube:nth-child(6) { z-index: 1; animation-delay: 1s; }
          .cube:nth-child(7) { z-index: 0; animation-delay: 1.2s; }

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
              background-color: var(--cube-color);
            }
            10% {
              background-color: var(--highlight-color);
            }
          }

          @keyframes face-glow {
            0%, 50%, 100% {
              color: transparent; /* #fff0 is equivalent to transparent */
              filter: none;
            }
            30% {
              color: #fff;
              filter: drop-shadow(0 14px 10px var(--highlight-color));
            }
          }

          @keyframes edge-glow {
            0%, 40%, 100% {
              box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.06), inset 0 0 12px 1px rgba(255, 255, 255, 0.06);
            }
            30% {
              box-shadow: 0 0 2px 0px var(--highlight-color);
            }
          }
        `}
      </style>

      {/* The main container for the loader */}
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
    </div>
  );
};

export default Loader;
