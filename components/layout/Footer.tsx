import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40">
      <div className="max-w-xl mx-auto w-full px-4 py-4 flex items-center justify-center">
        <p className="text-base text-muted-foreground">
          © {new Date().getFullYear()} Riya AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
