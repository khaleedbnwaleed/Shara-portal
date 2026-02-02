'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
}

interface Category {
  title: string;
  icon: string;
  plans: Plan[];
}

export default function PricingPlans() {
  const categories: Category[] = [
    {
      title: 'Residential Waste Management',
      icon: '🏠',
      plans: [
        {
          name: 'Basic Plan',
          price: '₦5,000/month',
          description: 'Weekly pickups, up to 2 bins',
          features: ['Weekly pickups', 'Up to 2 bins', 'Standard collection']
        },
        {
          name: 'Standard Plan',
          price: '₦8,000/month',
          description: 'Bi-weekly pickups, up to 4 bins, recycling included',
          features: ['Bi-weekly pickups', 'Up to 4 bins', 'Recycling included', 'Waste sorting']
        },
        {
          name: 'Premium Plan',
          price: '₦12,000/month',
          description: 'Unlimited pickups, waste sorting, and priority service',
          features: ['Unlimited pickups', 'Waste sorting', 'Priority service', '24/7 support']
        }
      ]
    },
    {
      title: 'Commercial Waste Management',
      icon: '🏢',
      plans: [
        {
          name: 'Starter Plan',
          price: '₦20,000/month',
          description: 'Scheduled pickups, up to 5 bins',
          features: ['Scheduled pickups', 'Up to 5 bins', 'Standard service']
        },
        {
          name: 'Growth Plan',
          price: '₦35,000/month',
          description: 'Increased frequency, waste sorting, and recycling support',
          features: ['Increased frequency', 'Waste sorting', 'Recycling support', 'Customized schedule']
        },
        {
          name: 'Enterprise Plan',
          price: '₦50,000+/month',
          description: 'Custom solutions, large volume pickup',
          features: ['Custom solutions', 'Large volume pickup', 'Dedicated account manager', 'Flexible terms']
        }
      ]
    },
    {
      title: 'Industrial Waste Management',
      icon: '🏭',
      plans: [
        {
          name: 'Basic Plan',
          price: '₦80,000/month',
          description: 'Bulk pickups, up to 10 bins',
          features: ['Bulk pickups', 'Up to 10 bins', 'Hazmat compliant']
        },
        {
          name: 'Advanced Plan',
          price: '₦150,000/month',
          description: 'Waste handling, large dumpster rental, recycling integration',
          features: ['Advanced waste handling', 'Large dumpster rental', 'Recycling integration', 'Environmental compliance']
        },
        {
          name: 'Custom Plan',
          price: 'Price on request',
          description: 'Tailored solutions for large-scale and specialized waste management',
          features: ['Fully customized', 'Large-scale solutions', 'Specialized handling', 'Dedicated support']
        }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider mb-3 sm:mb-4 inline-block">
            Pricing Plans
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Simple Plans, Simplified Waste Management
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Choose the perfect plan for your waste management needs. Flexible pricing tailored to residential, commercial, and industrial requirements.
          </p>
        </div>

        {/* Pricing Categories */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-2">
                  {category.title}
                </h3>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {category.plans.map((plan, planIndex) => (
                  <div
                    key={planIndex}
                    className="border-2 border-primary rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    {/* Plan Header */}
                    <div className="mb-6">
                      <h4 className="text-lg sm:text-xl font-bold text-primary mb-2">
                        {plan.name}
                      </h4>
                      <div className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                        {plan.price}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 flex-grow mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 px-6 bg-secondary hover:bg-secondary/80 text-primary font-bold rounded-lg transition-colors">
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 p-6 bg-secondary rounded-lg">
          <p className="text-sm text-gray-700">
            All plans include professional waste collection, environmentally responsible disposal, and monthly reporting.
          </p>
        </div>
      </div>
    </section>
  );
}
