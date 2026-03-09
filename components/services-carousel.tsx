'use client';

import React from 'react';
import Image from '@/components/NextImage';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ServicesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const services = [
    {
      id: 1,
      title: 'Smart Waste Collection',
      description:
        'Structured and technology-driven waste collection services for homes, offices, schools, and institutions.',
      image: '/asset/image/00.jpg',
      category: 'Collection',
      impact:
        'Ensures timely pickups, clean surroundings, and improved recycling rates across communities.',
    },
    {
      id: 2,
      title: 'Recycling & Resource Recovery',
      description:
        'Collecting, sorting, and processing plastics, paper, and metals into reusable resources.',
      image: '/asset/image/3.jpg',
      category: 'Recycling',
      impact:
        'Reduces landfill waste and transforms discarded materials into valuable products.',
    },
    {
      id: 3,
      title: 'Organic Waste Conversion',
      description:
        'Turning organic waste into compost and green products to support urban farming and soil health.',
      image: '/asset/image/7.jpeg',
      category: 'Composting',
      impact:
        'Nurtures local agriculture and reduces methane emissions from landfills.',
    },
    {
      id: 4,
      title: 'Environmental Education',
      description:
        'Awareness campaigns and training programs that empower individuals and communities to act sustainably.',
      image: '/asset/image/student.jpg',
      category: 'Education',
      impact:
        'Builds long-term behavior change and community ownership of waste solutions.',
    },
    {
      id: 5,
      title: 'Consultancy & ESG Advisory',
      description:
        'Tailored sustainability roadmaps, waste audits, and compliance support for organizations.',
      image: '/asset/image/11.jpg',
      category: 'Consulting',
      impact:
        'Helps businesses meet environmental standards while optimizing operational costs.',
    },
    {
      id: 6,
      title: 'Green Innovation Incubation',
      description:
        'Supporting startups with mentorship, technical coaching, and market access in the green economy.',
      image: '/asset/image/16.jpg',
      category: 'Innovation',
      impact:
        'Accelerates climate-tech solutions and fosters entrepreneurship in sustainability.',
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <span className="inline-block px-3 sm:px-4 py-2 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Tailored Waste Management Services
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore how our service offerings bring practical, sustainable waste solutions to communities, businesses, and institutions.
          </p>
        </div>

        {/* Services Carousel */}
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {services.map((service) => (
              <CarouselItem
                key={service.id}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
                  <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      loading="lazy"
                      quality={70}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                      {service.description}
                    </p>

                    <div className="mb-6 p-3 bg-secondary rounded-lg">
                      <p className="text-sm font-semibold text-primary">
                        {service.impact}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
