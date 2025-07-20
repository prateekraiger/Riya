import React from "react";
import Navbar from "@/components/layout/Navbar";
import FooterReveal from "@/components/layout/FooterReveal";

interface LayoutProps {
  children: React.ReactNode;
  className?: string; // Optional custom styling
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col bg-background overflow-x-hidden ${className}`}
    >
      <Navbar />
      <main className="flex-grow flex flex-col w-full relative">
        <div className="w-full h-full">{children}</div>
      </main>
      <FooterReveal />
    </div>
  );
};
