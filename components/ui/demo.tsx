"use client";

import { Component } from "@/components/ui/404-page-not-found";
import { Pricing } from "./pricing";

export default function DemoOne() {
  return <Component />;
}

// Export the PricingBasic component
export const PricingBasic = () => {
  const pricingPlans = [
    {
      name: "Basic",
      price: "9.99",
      yearlyPrice: "99.99",
      period: "month",
      features: [
        "Unlimited text conversations",
        "Basic emotional support",
        "Personalized responses",
        "24/7 availability",
        "Memory of past conversations",
      ],
      description: "Perfect for casual conversations and emotional support.",
      buttonText: "Get Started",
      href: "/signup",
      isPopular: false,
    },
    {
      name: "Premium",
      price: "19.99",
      yearlyPrice: "199.99",
      period: "month",
      features: [
        "Everything in Basic",
        "Voice conversations",
        "Advanced emotional intelligence",
        "Personalized growth suggestions",
        "Priority response time",
        "Custom conversation topics",
      ],
      description:
        "Enhanced experience with advanced features and deeper connection.",
      buttonText: "Go Premium",
      href: "/signup",
      isPopular: true,
    },
    {
      name: "Ultimate",
      price: "29.99",
      yearlyPrice: "299.99",
      period: "month",
      features: [
        "Everything in Premium",
        "3D avatar interactions",
        "Video chat capability",
        "Deep personalization",
        "Smart device integration",
        "Exclusive content and scenarios",
      ],
      description:
        "The most immersive and personalized AI companion experience.",
      buttonText: "Go Ultimate",
      href: "/signup",
      isPopular: false,
    },
  ];

  return (
    <Pricing
      plans={pricingPlans}
      title="Choose Your Riya Experience"
      description="Select the plan that best fits your needs.\nAll plans include a 7-day free trial with no credit card required."
    />
  );
};
