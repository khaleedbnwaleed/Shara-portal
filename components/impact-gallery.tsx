'use client';

import Image from 'next/image';
import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function ImpactGallery() {
  const plugin = React.useRef(
    Autoplay({ delay: 1000, stopOnInteraction: true })
  );

  const impactImages = [
    {
      src: '/asset/image/12.jpg',
      alt: 'Community waste collection drive',
      title: 'Collection Drive',
    },
    {
      src: '/asset/image/13.jpg',
      alt: 'Waste sorting and processing',
      title: 'Waste Sorting',
    },
    {
      src: '/asset/image/14.jpg',
      alt: 'Team and community collaboration',
      title: 'Team Collaboration',
    },
    {
      src: '/asset/image/15.jpg',
      alt: 'Environmental impact initiative',
      title: 'Impact Initiative',
    },
  ];

  return (
    <section id="impact" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold text-accent uppercase tracking-wider">
            Our Impact
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-3 sm:mt-4">
            Transforming Communities Through Action
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mt-4 sm:mt-6 max-w-2xl mx-auto">
            See how Shara Eco Solutions is making a real difference in waste management and community environmental responsibility across Nigeria.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {impactImages.map((image, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={image.src || '/placeholder.svg'}
                    alt={image.alt}
                    width={400}
                    height={300}
                    loading="lazy"
                    quality={70}
                    className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-bold text-lg">{image.title}</h3>
                      <p className="text-sm text-gray-100 mt-1">{image.alt}</p>
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
