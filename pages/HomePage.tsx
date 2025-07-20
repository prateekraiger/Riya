import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-center p-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark drop-shadow-sm">
          Meet Riya.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Your empathetic AI companion. Ready to listen, understand, and talk
          about anything. Experience a new kind of friendship.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/signup">Get Started For Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
