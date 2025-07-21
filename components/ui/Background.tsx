import React from "react";

const SoftPinkBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 h-full w-full"
      style={{
        zIndex: -10,
        background:
          "linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 50%, #f8bbd0 100%)",
        backgroundImage:
          "linear-gradient(to right, #80808017 1px, transparent 1px), linear-gradient(to bottom, #8080800b 1px, transparent 1px)",
        backgroundSize: "14px 24px",
      }}
    />
  );
};

export default SoftPinkBackground;
