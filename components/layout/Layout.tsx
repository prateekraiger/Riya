import React from "react";
import FloatingNavDemo from "@/components/ui/floating-navbar-demo";
import { Footer } from "./Footer";
import FooterReveal from "@/components/ui/FooterReveal";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FloatingNavDemo />
      <main className="flex-grow flex flex-col">{children}</main>
      {/* FooterReveal will show the new footer only when scrolled to the bottom */}
      <FooterReveal />
    </div>
  );
};
