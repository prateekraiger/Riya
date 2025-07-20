"use client";

import { Pricing } from "@/components/ui/pricing";

const demoPlans = [
  {
    name: "STARTER",
    price: "0",
    yearlyPrice: "0",
    period: "per month",
    features: [
      "20 messages per day",
      "Standard AI conversation",
      "Basic emotional responses",
      "Chat history (7 days)",
      "Web access (limited)",
    ],
    description:
      "Get to know Riya. Enjoy friendly AI chat, basic emotional support, and explore her personality for free.",
    buttonText: "Start for Free",
    href: "/signup",
    isPopular: false,
  },
  {
    name: "PREMIUM",
    price: "19",
    yearlyPrice: "15",
    period: "per month",
    features: [
      "Unlimited messages",
      "Advanced emotional intelligence",
      "Voice conversations",
      "Personalized memory",
      "Priority support",
      "Early access to new features",
      "Customizable Riya persona",
    ],
    description:
      "For deeper connection. Unlock unlimited chat, voice, advanced empathy, and a more personal Riya experience.",
    buttonText: "Upgrade to Premium",
    href: "/signup",
    isPopular: true,
  },
  {
    name: "PRO",
    price: "49",
    yearlyPrice: "39",
    period: "per month",
    features: [
      "All Premium features",
      "3D avatar & video chat",
      "Real-time emotion recognition",
      "Custom conversation styles",
      "Integration with smart devices",
      "VIP support",
      "Unlimited chat history",
      "Personalized AI training",
    ],
    description:
      "For the ultimate AI companion experience. Enjoy 3D avatar, video chat, smart home integration, and VIP support.",
    buttonText: "Go Pro",
    href: "/signup",
    isPopular: false,
  },
];

function PricingBasic() {
  return (
    <div className="w-full bg-background py-16 px-2 md:px-8">
      <Pricing
        plans={demoPlans}
        title="Riya AI Girlfriend Plans"
        description={`Choose the plan that fits your relationship with Riya.\nAll plans include secure chat, privacy-first design, and a caring AI companion.`}
      />
    </div>
  );
}

export { PricingBasic };
