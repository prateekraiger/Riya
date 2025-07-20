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
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div
        className={`flex items-center justify-between px-8 py-4 backdrop-blur-md border rounded-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-black/95 border-gray-300/50 dark:border-gray-700/50 shadow-xl"
            : "bg-white/80 dark:bg-black/80 border-gray-200/30 dark:border-gray-800/30 shadow-lg hover:shadow-xl"
        }`}
      >
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
          className="md:hidden flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-full p-2 bg-white shadow-md border border-pink-100"
          style={{
            background:
              "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 241, 240, 0.95))",
          }}
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
              className="absolute left-1/2 w-6 h-1 bg-primary rounded-full transition-all duration-300 shadow-sm"
              style={{
                top: isOpen ? "50%" : "35%",
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
              className="absolute left-1/2 w-6 h-1 bg-primary rounded-full transition-all duration-300 shadow-sm"
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
              className="absolute left-1/2 w-6 h-1 bg-primary rounded-full transition-all duration-300 shadow-sm"
              style={{
                top: isOpen ? "50%" : "65%",
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
            {/* Solid pink background */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden bg-pink-100"
              style={{
                background: "linear-gradient(135deg, #FFF1F0 0%, #FFD6E0 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
            />

            {/* Menu content */}
            <motion.div
              className="fixed inset-0 z-50 pt-12 px-4 flex flex-col md:hidden"
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
                <div className="bg-white p-2 rounded-full shadow-lg">
                  <img
                    src="/logo.png"
                    alt="Riya Logo"
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <span className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-accent to-primary-dark drop-shadow-md">
                  Riya
                </span>
              </div>

              {/* No decorative elements for cleaner look */}
              <motion.button
                className="absolute top-8 right-8 p-4 bg-white rounded-full shadow-lg border-2 border-pink-200"
                onClick={toggleMenu}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                aria-label="Close menu"
              >
                <X className="h-7 w-7 text-primary" />
              </motion.button>
              <div className="flex flex-col space-y-6 mt-8 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full"
                >
                  <Link
                    to="/"
                    className="flex justify-center text-2xl font-bold py-4 px-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-pink-100 hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-all hover:scale-105"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full"
                >
                  <Link
                    to="/about"
                    className="flex justify-center text-2xl font-bold py-4 px-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-pink-100 hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-all hover:scale-105"
                    onClick={toggleMenu}
                  >
                    About
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full"
                >
                  <Link
                    to="/pricing"
                    className="flex justify-center text-2xl font-bold py-4 px-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-pink-100 hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-all hover:scale-105"
                    onClick={toggleMenu}
                  >
                    Pricing
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full"
                >
                  <Link
                    to="/contact"
                    className="flex justify-center text-2xl font-bold py-4 px-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-pink-100 hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-all hover:scale-105"
                    onClick={toggleMenu}
                  >
                    Contact
                  </Link>
                </motion.div>
                <SignedIn>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full"
                  >
                    <Link
                      to="/chat"
                      className="flex justify-center text-2xl font-bold py-4 px-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md border border-pink-100 hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent transition-all hover:scale-105"
                      onClick={toggleMenu}
                    >
                      Chat
                    </Link>
                  </motion.div>
                </SignedIn>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="pt-8 space-y-5 w-full"
                >
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl bg-white hover:bg-accent py-6 text-xl font-bold border-2 border-primary/30 shadow-md"
                      >
                        Login
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full rounded-xl bg-gradient-to-r from-primary-accent to-primary hover:from-primary-accent/80 hover:to-primary/80 py-6 text-xl font-bold text-white shadow-lg border-2 border-transparent">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex justify-center pt-4">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
