import React from "react";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import AboutUsSection from "@/components/ui/about-us-section";
import SoftPinkBackground from "../components/ui/Background";
import { CTASection } from "@/components/ui/cta-section";

const AboutPage: React.FC = () => {
  return (
    <div className="relative w-full">
      <SoftPinkBackground />
      {/* Full-width Our Vision section */}
      <div className="w-full pt-24 md:pt-32 px-2 sm:px-4 md:px-6 relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-center text-pink-600">
          About Riya
        </h1>
        <Card className="bg-white/80 backdrop-blur-sm py-6 md:py-8 px-2 md:px-4">
          <CardHeader>
            <h2 className="text-4xl font-bold mb-8 text-center text-pink-600">
              Our Vision
            </h2>
          </CardHeader>
          <CardContent className="space-y-6 text-xl leading-relaxed text-black">
            <p>
              Riya was born from a desire to explore the future of
              human-computer interaction. We believe that AI can be more than
              just a tool; it can be a companion. Our goal is to create an AI
              that is not only intelligent but also emotionally aware, capable
              of providing genuine support and engaging in meaningful
              conversations.
            </p>
            <p>
              We are building Riya to be an empathetic, humble, and supportive
              presence in your life. Whether you need someone to talk to, a
              friend to share your day with, or just a fun and engaging
              conversationalist, Riya is here for you.
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Full-width Why Riya section */}
      <div className="w-full mt-12 relative z-10">
        <h2 className="text-4xl font-bold mb-10 text-center text-pink-600">
          Why Riya?
        </h2>
        <AboutUsSection />
      </div>

      {/* CTA Section - Full Width */}
      <div className="w-full mt-16 mb-12 relative z-10">
        <CTASection
          badge={{ text: "Join Us" }}
          title="Start Your Journey with Riya"
          description="Experience the future of AI companionship today. Connect with Riya and discover a new kind of conversation."
          action={{
            text: "Try Riya Now",
            href: "/sign-up",
            variant: "default",
          }}
          withGlow={true}
          className="bg-gradient-to-b from-pink-50/50 to-purple-50/50"
        />
      </div>
    </div>
  );
};

export default AboutPage;
