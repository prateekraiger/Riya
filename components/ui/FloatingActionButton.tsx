import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses = {
  primary:
    "bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary/25",
  secondary:
    "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-secondary/25",
  success:
    "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/25",
  warning:
    "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/25",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/25",
};

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  color = "primary",
  size = "md",
  className = "",
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-200
        border border-white/20
        backdrop-blur-sm
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      <Icon className={iconSizeClasses[size]} />
    </motion.button>
  );
};
