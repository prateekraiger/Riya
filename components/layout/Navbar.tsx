import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { useChatStore } from "../../store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@stackframe/react";

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
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Modern Glassmorphism Navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-4 backdrop-blur-xl border border-white/20 rounded-2xl lg:rounded-full transition-all duration-500 ${
            isScrolled
              ? "bg-white/90 dark:bg-gray-900/90 border-gray-200/30 dark:border-gray-700/30 shadow-2xl shadow-black/10"
              : "bg-white/70 dark:bg-gray-900/70 border-white/30 dark:border-gray-800/30 shadow-xl shadow-black/5"
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Logo Section */}
          <motion.div
            className="flex items-center space-x-3 lg:space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <img
                  src="/logo.png"
                  alt="Riya Logo"
                  className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full ring-2 ring-white/50 group-hover:ring-pink-300/50 transition-all duration-300"
                />
              </div>
              <span
                className="font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-black dark:text-white transition-all duration-300 group-hover:tracking-wide"
                style={{
                  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                  textShadow: "0 0 20px rgba(0,0,0,0.1)",
                }}
              >
                RIYA
              </span>
            </Link>
          </motion.div>

          {/* Modern Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }, index) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  to={to}
                  className="relative px-4 py-2 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-all duration-300 rounded-xl group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10">{label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 scale-95 group-hover:scale-100"></div>
                </Link>
              </motion.div>
            ))}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  to="/chat"
                  className="relative px-4 py-2 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-all duration-300 rounded-xl group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10">Chat</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 scale-95 group-hover:scale-100"></div>
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Enhanced CTA Section */}
          <div className="flex items-center space-x-3">
            {/* Desktop CTA */}
            <motion.div
              className="hidden lg:flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {!user ? (
                <Link to="/login">
                  <Button className="relative group px-6 py-2.5 bg-pink-100 text-pink-700 font-semibold rounded-full border-0 shadow-lg hover:bg-pink-200 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5">
                    <span className="relative z-10 flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Get Started</span>
                    </span>
                  </Button>
                </Link>
              ) : (
                <div className="scale-100 hover:scale-105 transition-transform duration-200">
                  <Link to="/handler/account-settings">
                    {(() => {
                      let initial = "U";
                      if (user && typeof user === "object") {
                        if (
                          "firstName" in user &&
                          typeof user.firstName === "string" &&
                          user.firstName.length > 0
                        ) {
                          initial = user.firstName.charAt(0).toUpperCase();
                        } else if (
                          "email" in user &&
                          typeof user.email === "string" &&
                          user.email.length > 0
                        ) {
                          initial = user.email.charAt(0).toUpperCase();
                        }
                      }
                      return (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold ring-2 ring-pink-200 hover:ring-pink-300 transition-all duration-200">
                          {initial}
                        </div>
                      );
                    })()}
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Mobile User Button & Menu */}
            <div className="lg:hidden flex items-center space-x-3">
              {user && (
                <div className="scale-90 hover:scale-95 transition-transform duration-200">
                  <Link to="/handler/account-settings">
                    {(() => {
                      // Fully type-safe and robust avatar logic
                      let avatarUrl: string | undefined = undefined;
                      let initial: string = "U";
                      const meta =
                        user &&
                        typeof user === "object" &&
                        (user as any).user_metadata &&
                        typeof (user as any).user_metadata === "object"
                          ? (user as any).user_metadata
                          : undefined;
                      if (
                        meta &&
                        typeof meta.avatar_url === "string" &&
                        meta.avatar_url.length > 0
                      ) {
                        avatarUrl = meta.avatar_url;
                      } else if (
                        user &&
                        typeof (user as any).avatar_url === "string" &&
                        (user as any).avatar_url.length > 0
                      ) {
                        avatarUrl = (user as any).avatar_url;
                      }
                      if (
                        meta &&
                        typeof meta.name === "string" &&
                        meta.name.length > 0
                      ) {
                        initial = meta.name.charAt(0).toUpperCase();
                      } else if (
                        meta &&
                        typeof meta.email === "string" &&
                        meta.email.length > 0
                      ) {
                        initial = meta.email.charAt(0).toUpperCase();
                      }
                      if (avatarUrl) {
                        return (
                          <img
                            src={avatarUrl}
                            alt="User avatar"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-pink-200 hover:ring-pink-300"
                          />
                        );
                      }
                      return (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold ring-2 ring-pink-200 hover:ring-pink-300">
                          {initial}
                        </div>
                      );
                    })()}
                  </Link>
                </div>
              )}
              <motion.button
                ref={menuButtonRef}
                onClick={toggleMenu}
                className="relative p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300 group"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-pink-600" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-pink-600" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Improved Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Modern Mobile Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl lg:hidden border-l border-gray-200/30 dark:border-gray-700/30"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              ref={menuRef}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                    <img
                      src="/logo.png"
                      alt="Riya Logo"
                      className="relative h-10 w-10 rounded-full ring-2 ring-pink-200/50"
                    />
                  </div>
                  <span className="font-black text-2xl text-black dark:text-white">
                    RIYA
                  </span>
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex flex-col p-6 space-y-2">
                {[
                  { to: "/", label: "Home", delay: 0.1 },
                  { to: "/about", label: "About", delay: 0.15 },
                  { to: "/pricing", label: "Pricing", delay: 0.2 },
                  { to: "/contact", label: "Contact", delay: 0.25 },
                ].map(({ to, label, delay }) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay, duration: 0.3 }}
                  >
                    <Link
                      to={to}
                      className="flex items-center py-4 px-4 text-2xl font-bold text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/10 dark:hover:to-purple-900/10 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link
                      to="/chat"
                      className="flex items-center py-4 px-4 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/10 dark:hover:to-purple-900/10 rounded-xl transition-all duration-300 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        Chat
                      </span>
                    </Link>
                  </motion.div>
                )}

                {/* Mobile Get Started Button - Always Visible */}
                <motion.div
                  className="pt-8 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  {!user ? (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full group py-4 bg-pink-100 text-pink-700 font-bold rounded-2xl shadow-xl hover:bg-pink-200 transition-all duration-300 transform hover:scale-105 border-0">
                        <span className="flex items-center justify-center space-x-2">
                          <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="text-lg">Get Started</span>
                        </span>
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Welcome back! 👋
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
