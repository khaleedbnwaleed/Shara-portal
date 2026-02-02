'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Linkedin, Twitter } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Team() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  const teamMembers = [
    {
      id: 1,
      name: 'Khalid Abdullahi',
      role: 'Executive Director',
      image: '/asset/image/khalid-abdullahi.jpg',
      email: 'khaleedbnwaleed@gmail.com',
      social: { 
        linkedin: 'https://www.linkedin.com/in/khaleedbnwaleed/',
        twitter: 'https://twitter.com'
      }
    },
    {
      id: 2,
      name: 'Muhammad K. Muhammad',
      role: 'Operations Manager',
      image: '/asset/image/amigo.jpg',
      email: 'muhammadkmuhammad1@gmail.com',
      social: { 
        linkedin: '#',
        twitter: 'https://x.com/bnwaleed_khalid'
      }
    },
    {
      id: 3,
      name: 'Ibrahim Suleiman',
      role: 'Technical Officer',
      image: '/asset/image/yarima.png',
      email: 'ibrahim@sharaecosg.com',
      social: { 
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 4,
      name: 'Abdulhakim Aminu',
      role: 'Community Relations',
      image: '/asset/image/abdul.jpg',
      email: 'chioma@sharaecosg.com',
      social: { 
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 5,
      name: 'Auwalu Habibu',
      role: 'Recycling Coordinator',
      image: '/asset/image/auwal.png',
      email: 'ibrahim@sharaecosg.com',
      social: { 
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
    {
      id: 6,
      name: 'Saadatu Ahmed Shehu',
      role: 'Recycling Coordinator',
      image: '/asset/image/moh.png',
      email: 'ibrahim@sharaecosg.com',
      social: { 
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
  ];

  return (
    <section id="team" className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <span className="inline-block px-3 sm:px-4 py-2 bg-secondary text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Team
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Meet the People Behind Shara
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Dedicated professionals committed to transforming waste management and empowering communities across Nigeria.
          </p>
        </div>

        {/* Team Carousel */}
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {teamMembers.map((member) => (
              <CarouselItem key={member.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="flex flex-col items-center text-center">
                  {/* Circular Profile Image */}
                  <div className="relative w-32 sm:w-40 h-32 sm:h-40 mb-4 sm:mb-6 rounded-full overflow-hidden shadow-lg border-4 border-gray-100 hover:shadow-xl transition-shadow">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      loading="lazy"
                      quality={85}
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-base sm:text-lg font-bold text-primary mb-1">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="text-xs sm:text-sm font-semibold text-accent mb-4 sm:mb-5 uppercase tracking-wider">
                    {member.role}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-2 sm:gap-3 justify-center">
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 sm:p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-primary hover:text-white transition-all"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail size={16} className="sm:w-5 sm:h-5" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                      aria-label={`LinkedIn profile`}
                    >
                      <Linkedin size={16} className="sm:w-5 sm:h-5" />
                    </a>
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 sm:p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-400 hover:text-white transition-all"
                      aria-label={`Twitter profile`}
                    >
                      <Twitter size={16} className="sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
}
