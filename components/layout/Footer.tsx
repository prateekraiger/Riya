import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40">
      <div className="container py-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Riya AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
