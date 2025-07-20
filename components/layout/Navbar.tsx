import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "../../supabase";
import { Button } from "../ui/button";
import { useChatStore } from "../../store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bot } from "lucide-react";
import { useState } from "react";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { clearMessages } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    clearMessages();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.08 }}
          >
            <Link
              to="/about"
              className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
            >
              About
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.08 }}
          >
            <Link
              to="/pricing"
              className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
            >
              Pricing
            </Link>
          </motion.div>
          {user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.08 }}
            >
              <Link
                to="/chat"
                className="text-lg font-semibold px-4 py-2 rounded-full transition-all duration-200 text-gray-600 hover:text-primary-dark hover:bg-primary/10 focus:bg-primary/20 focus:text-primary-accent"
              >
                Chat
              </Link>
            </motion.div>
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
            <>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full border-2 border-primary text-primary font-semibold px-6 py-2 text-lg bg-transparent hover:bg-primary hover:text-white hover:shadow-md transition-all duration-200 shadow-sm"
              >
                Logout
              </Button>
            </>
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
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-8 w-8 text-primary-accent" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-8 right-8 p-3"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-8 w-8 text-primary-accent" />
            </motion.button>
            <div className="flex flex-col space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link
                  to="/about"
                  className="text-xl text-[#3D1C20] font-medium hover:text-[#FF5D8F] transition-colors"
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
                  className="text-xl text-foreground font-medium hover:text-primary transition-colors"
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
                    className="text-xl text-foreground font-medium hover:text-primary transition-colors"
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
                    className="w-full rounded-full border-border/40 hover:bg-accent py-3 text-lg"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full rounded-full hover:bg-accent py-3 text-lg"
                    >
                      <Link to="/login" onClick={toggleMenu}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 py-3 text-lg"
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
