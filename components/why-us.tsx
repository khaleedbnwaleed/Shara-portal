'use client';

import Image from 'next/image';
import { Truck, Shield, Leaf, TrendingUp } from 'lucide-react';

export default function WhyUs() {
  const features = [
    {
      icon: Truck,
      title: 'Large Volume Pickup',
      description: 'Efficient waste collection for businesses, industries, and large-scale disposals.',
    },
    {
      icon: Shield,
      title: 'Certified Safe',
      description: 'All our processes meet international environmental and safety standards.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable practices that minimize environmental impact and pollution.',
    },
    {
      icon: TrendingUp,
      title: 'Data Driven',
      description: 'Smart analytics and tracking for optimized waste management solutions.',
    },
  ];

  return (
    <section id="why-us" className="bg-secondary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Image */}
          <div className="order-2 md:order-1">
            <Image
              src="/asset/image/12.jpg"
              alt="Why Choose Shara"
              width={400}
              height={500}
              className="rounded-2xl w-full max-w-md object-cover shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div>
              <span className="text-xs sm:text-sm font-bold text-primary uppercase">Why Choose Us</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-2">
                Your Sustainable Choice for Waste Management
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
              At Shara Eco Solutions Ltd., we offer a tech-driven waste management system that integrates AI, smart bins, and satellite tracking to ensure efficient waste collection and recycling.
            </p>

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
      </div>
    </section>
  );
}
