"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionWithCategoriesProps
  extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
    category?: string;
  }[];
  contactInfo?: {
    title: string;
    description?: string;
    buttonText: string;
    onContact?: () => void;
  };
}

const FaqSectionWithCategories = React.forwardRef<
  HTMLElement,
  FaqSectionWithCategoriesProps
>(({ className, title, description, items, contactInfo, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("py-16 w-full", className)} {...props}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl w-full mx-auto bg-white/80 dark:bg-card/80 rounded-3xl shadow-xl p-4 sm:p-8 md:p-14 border border-pink-100">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {/* FAQ Items */}
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  "mb-4 rounded-xl",
                  "bg-card text-card-foreground",
                  "border border-border/60",
                  "shadow-sm dark:shadow-black/10"
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "px-6 py-4 text-left hover:no-underline",
                    "data-[state=open]:border-b data-[state=open]:border-border/60"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    {item.category && (
                      <Badge
                        variant="secondary"
                        className="w-fit text-xs font-normal"
                      >
                        {item.category}
                      </Badge>
                    )}
                    <h3 className="text-lg font-medium text-foreground group-hover:text-primary">
                      {item.question}
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-4 pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact Section */}
          {contactInfo && (
            <div className="mt-16 text-center flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold text-pink-700 mb-2">
                Need more help?
              </h3>
              <p className="text-muted-foreground mb-2 text-lg">
                {contactInfo.title}
              </p>
              {contactInfo.description && (
                <p className="text-base text-muted-foreground mb-4">
                  {contactInfo.description}
                </p>
              )}
              <Link to="/contact" tabIndex={-1}>
                <Button
                  size="lg"
                  className="px-8 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-[#8ECAE6] to-[#219EBC] text-white shadow-lg hover:from-[#219EBC] hover:to-[#126782] transition-all duration-200 border-0"
                  onClick={contactInfo.onContact}
                >
                  {contactInfo.buttonText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
FaqSectionWithCategories.displayName = "FaqSectionWithCategories";

export { FaqSectionWithCategories };
