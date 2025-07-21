"use client";

import { buttonVariants } from "./button";
import { Label } from "./label";
import { Switch } from "./switch";
import { useMediaQuery } from "../../hooks/use-media-query";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "./number-flow";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = `Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.`,
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="container pt-32 pb-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
        </label>
        <span className="ml-2 font-semibold text-foreground">
          Annual billing <span className="text-primary">(Save 20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.97 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              `relative rounded-[2.5rem] border-[2px] p-12 bg-secondary/40 text-center flex flex-col justify-between min-h-[560px] w-full shadow-2xl transition-all duration-300`,
              plan.isPopular
                ? "border-primary border-4 scale-105 z-20 bg-primary/10"
                : "border-border z-10 bg-card/90",
              !plan.isPopular && "mt-5",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary py-1.5 px-4 rounded-bl-2xl rounded-tr-2xl flex items-center shadow-lg">
                <Star className="text-primary-foreground h-5 w-5 fill-current" />
                <span className="text-primary-foreground ml-2 font-sans font-bold text-base">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-2xl font-extrabold text-primary mb-3 tracking-wide">
                {plan.name}
              </p>
              <div className="mt-4 flex items-center justify-center gap-x-2">
                <span className="text-7xl font-extrabold tracking-tight text-foreground">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    formatter={(value) => value}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-lg font-semibold leading-6 tracking-wide text-muted-foreground">
                    / {plan.period}
                  </span>
                )}
              </div>

              <p className="text-lg leading-7 text-foreground mt-4 mb-6 min-h-[56px] font-medium">
                {plan.description}
              </p>

              <ul className="mt-4 gap-3 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-left text-lg text-foreground font-normal">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-8 border-border/60" />

              <Link
                to={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.isPopular ? "default" : "outline",
                    size: "lg",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-xl font-bold tracking-tighter rounded-2xl shadow-lg py-4 px-8",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                  plan.isPopular
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-primary border-primary"
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-8 text-base leading-6 text-muted-foreground min-h-[40px]">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
