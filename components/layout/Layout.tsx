import React from "react";
import Navbar from "@/components/layout/Navbar";
import FooterReveal from "@/components/layout/FooterReveal";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  className?: string; // Optional custom styling
}

export const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  const location = useLocation();
  const hasCustomBackground =
    location.pathname === "/pricing" ||
    location.pathname === "/contact" ||
    location.pathname === "/about";

  return (
    <div
      className={`min-h-screen w-full flex flex-col overflow-x-hidden ${
        !hasCustomBackground ? "bg-background" : ""
      } ${className}`}
    >
      <Navbar />
      <main className="flex-grow flex flex-col w-full relative">
        <div className="w-full h-full">{children}</div>
      </main>
      <FooterReveal />
    </div>
  );
};
