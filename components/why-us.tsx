'use client';

import { Truck, Shield, Leaf, TrendingUp } from 'lucide-react';

export default function WhyUs() {
  const features = [
    {
      icon: Truck,
      title: 'Reliable Collection',
      description: 'Scheduled and on-demand pickups with real-time routing to minimize delays.',
    },
    {
      icon: Shield,
      title: 'Fully Compliant',
      description: 'Certified handling and disposal aligned with international environmental standards.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Impact',
      description: 'Recycling-first processes that reduce landfill waste and lower your carbon footprint.',
    },
    {
      icon: TrendingUp,
      title: 'Transparent Insights',
      description: 'Actionable reporting and analytics so you can track performance & savings.',
    },
  ];

  return (
    <section id="why-us" className="bg-secondary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-10 mb-12 sm:mb-16">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-block px-3 sm:px-4 py-2 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              Your Sustainable Choice for Waste Management
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
              At Shara Eco Solutions Ltd., we use smart technology and certified processes to deliver consistent results: faster pickups, fewer safety incidents, and more waste diverted from landfills.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
              Every customer receives transparent reporting, clear pricing, and a dedicated support team—so you know exactly what you’re getting and why it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-white rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
                >
                  <Icon size={28} className="text-primary mb-2" />
                  <h3 className="font-bold text-primary mb-2 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
