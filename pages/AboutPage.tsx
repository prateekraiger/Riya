import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8 text-center">About Riya</h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Riya was born from a desire to explore the future of human-computer interaction. We believe that AI can be more than just a tool; it can be a companion. Our goal is to create an AI that is not only intelligent but also emotionally aware, capable of providing genuine support and engaging in meaningful conversations.
            </p>
            <p>
              We are building Riya to be an empathetic, humble, and supportive presence in your life. Whether you need someone to talk to, a friend to share your day with, or just a fun and engaging conversationalist, Riya is here for you.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>The Technology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
             <p>Riya is powered by cutting-edge technology:</p>
             <ul className="list-disc list-inside space-y-2">
                <li><strong>React & TypeScript:</strong> For a modern, robust, and scalable frontend.</li>
                <li><strong>Google Gemini API:</strong> The powerful large language model that gives Riya her voice and personality.</li>
                <li><strong>Supabase:</strong> Providing secure authentication and a real-time database to remember your conversations.</li>
                <li><strong>Shadcn/UI & Tailwind CSS:</strong> Crafting a beautiful, responsive, and accessible user interface.</li>
             </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;