'use client';

import React from 'react';
import Image from '@/components/NextImage';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Projects() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  const projects = [
    {
      id: 1,
      title: 'Community Waste Cleanup Initiative',
      description: 'Large-scale waste collection drive engaging 50+ community volunteers across Jigawa state.',
      image: '/asset/image/00.jpg',
      category: 'Community',
      impact: 'Improved local sanitation and diverted tons of waste from landfills.',
    },
      {
      id: 3,
      title: 'Residential Waste Sanitation',
      description: 'Door-to-door waste collection service ensuring proper sorting at source.',
      image: '/asset/image/3.jpg',
      category: 'Services',
      impact: 'Helped households reduce landfill waste and increase recycling rates.',
    },
    {
      id: 4,
      title: 'Environmental Education Campaign',
      description: 'Comprehensive waste management education reaching schools and communities.',
      image: '/asset/image/student.jpg',
      category: 'Education',
      impact: 'Engaged hundreds of students with sustainable waste practices.',
    },
    {
      id: 5,
      title: 'Waste-to-Resource Material Sorting',
      description: 'Advanced sorting facility converting collected waste into valuable recyclable materials.',
      image: '/asset/image/7.jpeg',
      category: 'Processing',
      impact: 'Enabled recycling streams to be diverted into usable raw materials.',
    },
    {
      id: 6,
      title: 'Youth Volunteer Empowerment Program',
      description: 'Training young people as waste management professionals and community leaders.',
      image: '/asset/image/16.jpg',
      category: 'Training',
      impact: 'Empowered youth with skills to drive local waste initiatives.',
    },
    {
      id: 8,
      title: 'Community Engagement Drive',
      description: 'Building awareness and participation from local communities in waste management.',
      image: '/asset/image/11.jpg',
      category: 'Community',
      impact: 'Increased volunteer participation and local recycling uptake.',
    },
    {
      id: 9,
      title: 'Environmental Impact Project',
      description: 'Transforming waste management practices to create lasting environmental change.',
      image: '/asset/image/10.jpg',
      category: 'Infrastructure',
      impact: 'Delivered measurable reductions in community waste footprints.',
    },
  ];

  const categories = ['All', 'Community', 'Infrastructure', 'Services', 'Education', 'Processing', 'Training'];

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <span className="inline-block px-3 sm:px-4 py-2 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Projects
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Transforming Communities Through Action
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore the impactful projects and initiatives we've executed across Nigeria to create lasting environmental change.
          </p>
        </div>

        {/* Projects Carousel */}
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full"
        >
          <CarouselContent>
            {projects.map((project) => (
              <CarouselItem key={project.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      loading="lazy"
                      quality={70}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {project.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    {/* Impact */}
                    <div className="mb-6 p-3 bg-secondary rounded-lg">
                      <p className="text-sm font-semibold text-primary">
                        {project.impact}
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
