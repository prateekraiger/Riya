import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  headerActions?: React.ReactNode;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "lg",
  showCloseButton = true,
  closeOnOverlayClick = true,
  headerActions,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden ${maxWidthClasses[maxWidth]} mx-4`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Header */}
          {(title || showCloseButton) && (
            <div className="relative p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 via-primary/3 to-primary-accent/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary-accent/[0.02]" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {icon && (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary-accent/20 rounded-xl flex items-center justify-center border border-primary/20">
                      {icon}
                    </div>
                  )}
                  {title && (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {title}
                      </h2>
                      {subtitle && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {headerActions}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2.5 hover:bg-secondary/80 rounded-xl transition-all duration-200 group border border-transparent hover:border-border/50"
                      title="Close"
                    >
                      <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(85vh-120px)]">
            {children}
          </div>

          {/* Close hint for mobile */}
          <div className="md:hidden absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
