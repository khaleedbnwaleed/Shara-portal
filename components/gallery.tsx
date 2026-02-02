'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { X } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const galleryImages = [
    {
      id: 1,
      src: '/images/pxl-20251025-072001191.jpg',
      alt: 'Community collection drive with safety vests',
      title: 'Community Collection',
    },
    {
      id: 2,
      src: '/images/pxl-20251025-072911450.jpg',
      alt: 'E-waste sorting and recycling',
      title: 'E-Waste Processing',
    },
    {
      id: 3,
      src: '/images/pxl-20251025-082419643.jpg',
      alt: 'Team and community members together',
      title: 'Team & Community',
    },
    {
      id: 4,
      src: '/images/pxl-20251025-070725078.jpg',
      alt: 'Waste collection in residential area',
      title: 'Residential Collection',
    },
    {
      id: 5,
      src: '/images/pxl-20251025-081428784.jpg',
      alt: 'Team organizing collected materials',
      title: 'Material Organization',
    },
    {
      id: 6,
      src: '/images/pxl-20251025-071725332.jpg',
      alt: 'Field operations and collection',
      title: 'Field Operations',
    },
    {
      id: 7,
      src: '/images/pxl-20251025-071524857.jpg',
      alt: 'Community engagement initiative',
      title: 'Community Engagement',
    },
  ];

  return (
    <section id="gallery" className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <span className="inline-block px-3 sm:px-4 py-2 bg-secondary text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Gallery
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Visual Story of Our Impact
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A glimpse into the real work happening on the ground as we transform waste management and empower communities.
          </p>
        </div>

        {/* Gallery Carousel */}
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {galleryImages.map((image) => (
              <CarouselItem key={image.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div
                  onClick={() => setSelectedImage(image.src)}
                  className="group relative h-48 sm:h-72 overflow-hidden rounded-2xl cursor-pointer bg-gray-200"
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    quality={70}
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="w-full p-6 text-white">
                      <h3 className="text-lg font-bold">{image.title}</h3>
                      <p className="text-sm text-gray-200">{image.alt}</p>
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Full view"
              width={1200}
              height={800}
              className="w-full h-auto rounded-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} className="text-black" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
