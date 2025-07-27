import React from "react";
import { motion } from "framer-motion";
import { Heart, Trophy, Sparkles, User } from "lucide-react";

interface RiyaActionButtonsProps {
  onShowCheckin: () => void;
  onShowAchievements: () => void;
  onShowHighlights: () => void;
  onShowProfile: () => void;
}

export const RiyaActionButtons: React.FC<RiyaActionButtonsProps> = ({
  onShowCheckin,
  onShowAchievements,
  onShowHighlights,
  onShowProfile,
}) => {
  const buttons = [
    {
      id: "checkin",
      icon: Heart,
      label: "Daily Check-in",
      onClick: onShowCheckin,
      gradient: "from-pink-500/20 to-purple-500/20",
      hoverGradient: "hover:from-pink-500/30 hover:to-purple-500/30",
      border: "border-pink-500/30",
      iconColor: "text-pink-500",
      hoverIconColor: "group-hover:text-pink-600",
    },
    {
      id: "achievements",
      icon: Trophy,
      label: "Achievements",
      onClick: onShowAchievements,
      gradient: "from-yellow-500/20 to-orange-500/20",
      hoverGradient: "hover:from-yellow-500/30 hover:to-orange-500/30",
      border: "border-yellow-500/30",
      iconColor: "text-yellow-600",
      hoverIconColor: "group-hover:text-yellow-700",
    },
    {
      id: "highlights",
      icon: Sparkles,
      label: "Highlights",
      onClick: onShowHighlights,
      gradient: "from-purple-500/20 to-blue-500/20",
      hoverGradient: "hover:from-purple-500/30 hover:to-blue-500/30",
      border: "border-purple-500/30",
      iconColor: "text-purple-600",
      hoverIconColor: "group-hover:text-purple-700",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      onClick: onShowProfile,
      gradient: "from-secondary/50 to-secondary/60",
      hoverGradient: "hover:from-secondary/70 hover:to-secondary/80",
      border: "border-border/50",
      iconColor: "text-muted-foreground",
      hoverIconColor: "group-hover:text-foreground",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Desktop Layout - 2x2 Grid */}
      <div className="hidden sm:grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {buttons.map((button, index) => (
          <motion.button
            key={button.id}
            onClick={button.onClick}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl
              bg-gradient-to-br ${button.gradient} ${button.hoverGradient}
              border ${button.border}
              transition-all duration-200 group
              backdrop-blur-sm
            `}
            title={button.label}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button.icon
              className={`w-6 h-6 ${button.iconColor} ${button.hoverIconColor} transition-colors`}
            />
            <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {button.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Mobile Layout - Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-hide">
          {buttons.map((button, index) => (
            <motion.button
              key={button.id}
              onClick={button.onClick}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-xl
                bg-gradient-to-br ${button.gradient} ${button.hoverGradient}
                border ${button.border}
                transition-all duration-200 group
                backdrop-blur-sm
                min-w-[80px] flex-shrink-0
              `}
              title={button.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button.icon
                className={`w-5 h-5 ${button.iconColor} ${button.hoverIconColor} transition-colors`}
              />
              <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors text-center leading-tight">
                {button.id === "checkin"
                  ? "Check-in"
                  : button.id === "achievements"
                  ? "Awards"
                  : button.id === "highlights"
                  ? "Highlights"
                  : "Profile"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
