import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { useChatStore } from "../../store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
              <img
                src="/logo.png"
                alt="Riya Logo"
                className="h-8 w-8 rounded-full"
              />
              <span
                className="font-bold text-3xl tracking-wide text-primary-dark drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                style={{
                  letterSpacing: "0.04em",
                  textShadow: "0 2px 8px rgba(255,93,143,0.10)",
                }}
              >
                RIYA
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
          <SignedIn>
            <Link
              to="/chat"
              className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
            >
              Chat
            </Link>
          </SignedIn>
        </nav>

        {/* Desktop CTA Buttons */}
        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="rounded-full px-6 py-2 text-lg font-semibold bg-primary text-white hover:bg-primary-dark shadow-md transition-colors">
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="rounded-full px-6 py-2 text-lg font-semibold bg-primary-accent text-white hover:bg-primary-dark shadow-md transition-colors">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-full p-2"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navbar-menu"
          ref={menuButtonRef}
          whileTap={{ scale: 0.9 }}
          tabIndex={0}
        >
          <span className="relative w-10 h-10 flex items-center justify-center">
            {/* Top line */}
            <motion.span
              initial={false}
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : -8,
              }}
              className="absolute left-1/2 w-7 h-1.5 bg-pink-500 rounded transition-all duration-300"
              style={{
                top: isOpen ? "50%" : "32%",
                transform: isOpen
                  ? "translate(-50%, -50%) rotate(45deg)"
                  : "translate(-50%, 0) rotate(0deg)",
              }}
            />
            {/* Middle line */}
            <motion.span
              initial={false}
              animate={{
                opacity: isOpen ? 0 : 1,
              }}
              className="absolute left-1/2 w-7 h-1.5 bg-pink-400 rounded transition-all duration-300"
              style={{
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            {/* Bottom line */}
            <motion.span
              initial={false}
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : 8,
              }}
              className="absolute left-1/2 w-7 h-1.5 bg-pink-300 rounded transition-all duration-300"
              style={{
                top: isOpen ? "50%" : "68%",
                transform: isOpen
                  ? "translate(-50%, -50%) rotate(-45deg)"
                  : "translate(-50%, 0) rotate(0deg)",
              }}
            />
          </span>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleMenu}
            />
            <motion.div
              className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 pt-12 px-4 flex flex-col md:hidden shadow-2xl"
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
                <img
                  src="/logo.png"
                  alt="Riya Logo"
                  className="h-8 w-8 rounded-full"
                />
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
                  transition={{ delay: 0.05 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    to="/"
                    className="text-2xl text-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-colors"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    to="/contact"
                    className="text-2xl text-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-colors"
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>
                </motion.div>
                <SignedIn>
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
                </SignedIn>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="pt-8 space-y-4"
                >
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        className="w-full rounded-full hover:bg-accent py-4 text-xl font-semibold"
                      >
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full rounded-full bg-gradient-to-r from-primary-accent to-primary hover:from-primary-accent/80 hover:to-primary/80 py-4 text-xl font-semibold text-white shadow-md">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
