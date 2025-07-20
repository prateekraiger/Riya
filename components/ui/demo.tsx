"use client";

import { Pricing } from "@/components/ui/pricing";
import { FaqSectionWithCategories } from "@/components/ui/faq-with-categories";

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

const DEMO_FAQS = [
  {
    question: "How do I get started?",
    answer:
      "Getting started is easy! Simply sign up for an account and follow our quick setup guide. We'll walk you through each step of the process.",
    category: "Getting Started",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
    category: "Billing",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
    category: "Pricing",
  },
  {
    question: "How can I contact support?",
    answer:
      "Our support team is available 24/7 through our help center, email support, or live chat. We typically respond within 2 hours.",
    category: "Support",
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

export function FaqSectionWithCategoriesDemo() {
  return (
    <FaqSectionWithCategories
      title="Frequently Asked Questions"
      description="Find answers to common questions about our services"
      items={DEMO_FAQS}
      contactInfo={{
        title: "Still have questions?",
        buttonText: "Contact Support",
        onContact: () => console.log("Contact support clicked"),
      }}
    />
  );
}
