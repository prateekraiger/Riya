import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get to know Riya.',
    features: ['20 messages per day', 'Standard AI model', 'Chat history'],
    cta: 'Start for Free',
  },
  {
    name: 'Premium',
    price: '$9',
    description: 'For a deeper connection.',
    features: ['Unlimited messages', 'Advanced AI model', 'Voice conversations', 'Priority support'],
    cta: 'Upgrade to Premium',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$19',
    description: 'For the ultimate experience.',
    features: ['All Premium features', 'Early access to new features', 'Highest priority support'],
    cta: 'Go Pro',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Find the perfect plan</h1>
          <p className="text-muted-foreground mt-2">Start for free, then upgrade when you're ready for more.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.highlight ? 'border-primary ring-2 ring-primary' : ''}`}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={tier.highlight ? 'default' : 'outline'}>
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
