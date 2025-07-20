import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../supabase';
import { Button } from '../ui/button';
import { useChatStore } from '../../store/useChatStore';
import { Bot } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clearMessages } = useChatStore();

  const handleLogout = async () => {
    await signOut();
    clearMessages();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Riya</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
          <Link to="/pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/chat">Chat</Link>
              </Button>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};