'use client';

import React from 'react';
import Image from '@/components/NextImage';
import { Linkedin, Twitter } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
};

export type TeamCategory = {
  title: string;
  description?: string;
  members: TeamMember[];
};

export default function TeamPage({ categories }: { categories: TeamCategory[] }) {
  const coreTeamAutoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-2 bg-secondary text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Team
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Meet the team driving Shara forward
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Our people are our strength. Learn about the Board of Trustees, Core Team, Volunteers, and Ambassadors who power our mission.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category.title} className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                {category.title}
              </h2>
              {category.description ? (
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  {category.description}
                </p>
              ) : null}
            </div>

            <Carousel
              opts={{
                align: 'center',
                loop: true,
              }}
              plugins={
                category.title.toLowerCase().includes('core')
                  ? [coreTeamAutoplay.current]
                  : []
              }
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {category.members.map((member) => (
                  <CarouselItem
                    key={member.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-32 sm:w-40 h-32 sm:h-40 mb-4 sm:mb-6 rounded-full overflow-hidden shadow-lg border-4 border-gray-100 hover:shadow-xl transition-shadow">
                        <Image
                          src={member.image ?? '/asset/image/student.jpg'}
                          alt={member.name}
                          fill
                          className="object-cover object-center"
                          loading="lazy"
                          quality={85}
                        />
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-primary mb-1">
                        {member.name}
                      </h3>

                      <p className="text-xs sm:text-sm font-semibold text-accent mb-4 sm:mb-5 uppercase tracking-wider">
                        {member.role}
                      </p>

                      <div className="flex gap-2 sm:gap-3 justify-center">
                        {member.social?.linkedin ? (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                            aria-label={`LinkedIn profile`}
                          >
                            <Linkedin size={16} className="sm:w-5 sm:h-5" />
                          </a>
                        ) : null}
                        {member.social?.twitter ? (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-400 hover:text-white transition-all"
                            aria-label={`Twitter profile`}
                          >
                            <Twitter size={16} className="sm:w-5 sm:h-5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        ))}
      </div>
    </section>
  );
}
