// import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTASectionProps {
  badge?: {
    text: string;
  };
  title: string;
  description?: string;
  action: {
    text: string;
    href: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  };
  withGlow?: boolean;
  className?: string;
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
}: CTASectionProps) {
  return (
    <section className={cn("overflow-hidden pt-0 md:pt-0 w-full", className)}>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8 md:py-24">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="text-muted-foreground">
              {badge.text}
            </Badge>
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          className="text-3xl font-semibold sm:text-5xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        {/* Description */}
        {description && (
          <motion.p
            className="text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Button variant={action.variant || "default"} size="lg" asChild>
            <a href={action.href}>{action.text}</a>
          </Button>
        </motion.div>

        {/* Glow Effect */}
        {withGlow && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 1) 8rem)",
              boxShadow:
                "0 -16px 128px 0 rgba(255, 93, 143, 0.5) inset, 0 -16px 32px 0 rgba(255, 93, 143, 0.5) inset",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          />
        )}
      </div>
    </section>
  );
}
