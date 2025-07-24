// import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

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

export function SimplePricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you",
}: PricingProps) {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border-2 p-8 bg-white text-center flex flex-col justify-between min-h-[560px] w-full shadow-lg ${
              plan.isPopular ? "border-pink-500" : "border-gray-200"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-pink-500 py-1 px-3 rounded-bl-lg rounded-tr-lg text-white font-bold">
                Popular
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-2xl font-bold text-pink-600 mb-3">
                {plan.name}
              </p>
              <div className="mt-4 flex items-center justify-center">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-lg text-gray-500">/ {plan.period}</span>
              </div>

              <p className="text-lg text-gray-700 mt-4 mb-6">
                {plan.description}
              </p>

              <ul className="mt-4 space-y-3 flex flex-col">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-pink-500 mt-1" />
                    <span className="text-left text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={plan.href}
                  className={`block w-full py-3 px-4 rounded-lg font-bold ${
                    plan.isPopular
                      ? "bg-pink-500 text-white hover:bg-pink-600"
                      : "bg-gray-100 text-pink-500 border border-pink-500 hover:bg-gray-200"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
