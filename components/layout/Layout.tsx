import React from "react";
import FloatingNavDemo from "@/components/ui/floating-navbar-demo";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <FloatingNavDemo />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};
