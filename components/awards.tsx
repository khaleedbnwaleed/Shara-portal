'use client';
import React from 'react';
import Image from '@/components/NextImage';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel'

const awards = [
  {
    title: 'Winners of Initiative for Impact (I4I) Business Competition',
    year: 'Jigawa State - 2025',
    image: '/asset/image/I4I.jpeg',
  },
  {
    title: 'Ideas and Data Global Excellence Award',
    year: 'Katsina State - 2025',
    image: '/asset/image/IDGA.jpeg',
  },

]

export default function Awards() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="awards" className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold">Awards & Achievements</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Recognitions for our work in sustainable waste management and community empowerment.
          </p>
        </div>

        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="flex items-stretch">
            {awards.map((a) => (
              <CarouselItem key={a.title}>
                <div className="p-4 min-h-[220px] flex flex-col items-center gap-6 bg-white rounded-lg shadow-sm border">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                    {/* Image holder: using a sample image from public/asset/image. Replace as needed. */}
                    <Image
                      src={a.image}
                      alt={a.title}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                      placeholder="empty"
                    />
                  </div>

                  <div className="w-full text-center">
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold">{a.title}</h3>
                      <span className="text-sm text-muted-foreground">{a.year}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Awarded for outstanding contribution to sustainable practices and community development.
                    </p>
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
  )
}
