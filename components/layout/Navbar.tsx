import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { useChatStore } from "../../store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clearMessages } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    clearMessages();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen((open) => !open);

  // Close menu on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    menuRef.current.addEventListener("keydown", handleTab);
    return () => menuRef.current?.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  return (
    <div className="flex justify-center w-full py-8 px-4">
      <div className="flex items-center justify-between px-8 py-4 bg-surface/90 backdrop-blur-md border border-border rounded-full shadow-lg w-full max-w-4xl relative z-10">
        <div className="flex items-center">
          <motion.div
            className="w-10 h-10 mr-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <Bot className="h-8 w-8 text-primary" />
              <span
                className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-accent to-primary-dark drop-shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:animate-shimmer"
                style={{
                  backgroundSize: "200% 200%",
                  backgroundPosition: "0% 50%",
                }}
              >
                Riya
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
          >
            About
          </Link>
          <Link
            to="/pricing"
            className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
          >
            Contact
          </Link>
          {user && (
            <Link
              to="/chat"
              className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
            >
              Chat
            </Link>
          )}
        </nav>

        {/* Desktop CTA Buttons */}
        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {user ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-full border-2 border-primary text-primary font-semibold px-6 py-2 text-lg bg-transparent hover:bg-primary hover:text-white hover:shadow-md transition-all duration-200 shadow-sm"
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-full hover:bg-primary/10 px-6 py-2 text-lg font-semibold"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-primary hover:bg-primary-dark text-white px-6 py-2 text-lg font-semibold shadow-md transition-colors"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navbar-menu"
          ref={menuButtonRef}
          whileTap={{ scale: 0.9 }}
        >
          <span className="relative w-8 h-8 flex items-center justify-center">
            <motion.span
              initial={false}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 0,
              }}
              className="absolute left-1/2 top-1/2 w-6 h-1 bg-primary-accent rounded transition-all"
              style={{
                transform: isOpen
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : "translate(-50%, -10px) rotate(0deg)",
              }}
            />
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
              }}
              className="absolute left-1/2 top-1/2 w-6 h-1 bg-primary-accent rounded transition-all"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            />
            <motion.span
              initial={false}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -8 : 0,
              }}
              className="absolute left-1/2 top-1/2 w-6 h-1 bg-primary-accent rounded transition-all"
              style={{
                transform: isOpen
                  ? "translate(-50%, -50%) rotate(-45deg)"
                  : "translate(-50%, 10px) rotate(0deg)",
              }}
            />
          </span>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 pt-12 px-4 flex flex-col md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            id="mobile-navbar-menu"
            aria-modal="true"
            role="dialog"
            ref={menuRef}
          >
            {/* Branding at top of mobile menu */}
            <div className="flex items-center gap-3 mb-8 mt-2">
              <Bot className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-accent to-primary-dark drop-shadow-md">
                Riya
              </span>
            </div>
            <motion.button
              className="absolute top-8 right-8 p-3"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className="h-8 w-8 text-primary-accent" />
            </motion.button>
            <div className="flex flex-col space-y-8 mt-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  to="/about"
                  className="text-2xl text-[#3D1C20] font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-colors"
                  onClick={toggleMenu}
                >
                  About
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  to="/pricing"
                  className="text-2xl text-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-colors"
                  onClick={toggleMenu}
                >
                  Pricing
                </Link>
              </motion.div>
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    to="/chat"
                    className="text-2xl text-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-colors"
                    onClick={toggleMenu}
                  >
                    Chat
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-8 space-y-4"
              >
                {user ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    variant="outline"
                    className="w-full rounded-full border-border/40 hover:bg-accent py-4 text-xl font-semibold"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full rounded-full hover:bg-accent py-4 text-xl font-semibold"
                    >
                      <Link to="/login" onClick={toggleMenu}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full rounded-full bg-gradient-to-r from-primary-accent to-primary hover:from-primary-accent/80 hover:to-primary/80 py-4 text-xl font-semibold text-white shadow-md"
                    >
                      <Link to="/signup" onClick={toggleMenu}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
