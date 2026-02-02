'use client';

import { Trash2, Truck, RotateCw } from 'lucide-react';

export default function ServicesHighlight() {
  const services = [
    {
      icon: Trash2,
      title: 'Safe Disposal',
      description: 'Environmentally friendly waste disposal methods that minimize pollution and health risks.',
    },
    {
      icon: Truck,
      title: 'Scheduled Pickup',
      description: 'Smart waste collection system allowing you to schedule pickups for timely and efficient waste management.',
    },
    {
      icon: RotateCw,
      title: 'Extensive Recycling',
      description: 'Process plastics, paper, metals, and organic waste into reusable materials supporting a circular economy.',
    },
  ];

  return (
    <section className="bg-primary text-primary-foreground py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex gap-3 sm:gap-4 hover:scale-105 transition-transform">
                <div className="flex-shrink-0">
                  <Icon size={36} sm:size={48} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
