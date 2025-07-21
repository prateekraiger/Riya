import React from "react";
import { Pricing } from "../components/ui/pricing";

const PricingPage: React.FC = () => {
  const pricingPlans = [
    {
      name: "Basic",
      price: 499,
      yearlyPrice: 4190, // 499 * 12 * 0.7 ≈ 4190
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
      price: 899,
      yearlyPrice: 7550, // 899 * 12 * 0.7 ≈ 7550
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
      price: 1299,
      yearlyPrice: 10990, // 1299 * 12 * 0.7 ≈ 10990
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
    <div className="min-h-screen">
      <Pricing
        plans={pricingPlans}
        title="Choose Your Riya Experience"
        description="Select the plan that best fits your needs.\nAll plans include a 7-day free trial with no credit card required."
        currency="INR"
      />
    </div>
  );
};

export default PricingPage;
