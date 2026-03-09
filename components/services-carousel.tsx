'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const services = [
  {
    id: 'collection',
    title: 'Waste Collection & Management',
    subtitle:
      'Structured waste collection services, smart bin deployment, and on‑site segregation to keep communities clean and safe.',
    items: [
      {
        title: 'Scheduled Waste Pickup',
        description: 'Reliable recurring pickups for homes, schools, and businesses to prevent overflow and litter.',
      },
      {
        title: 'Smart Bin Deployment',
        description: 'Sensor-enabled bins with route optimization for efficient collection and monitoring.',
      },
      {
        title: 'Segregation at Source',
        description: 'Training and tools to help teams sort waste correctly before it leaves the site.',
      },
    ],
  },
  {
    id: 'recycling',
    title: 'Recycling & Resource Recovery',
    subtitle:
      'Turning waste into value through sorting, material recovery, and circular economy initiatives.',
    items: [
      {
        title: 'Materials Sorting & Processing',
        description: 'Collect and separate plastics, paper, metals, and glass for downstream recycling.',
      },
      {
        title: 'Buy-Back & Incentive Programs',
        description: 'Reward communities for supplying recyclable materials and reduce landfill burden.',
      },
      {
        title: 'Upcycling Partnerships',
        description: 'Collaborate with industry to convert waste streams into usable products.',
      },
    ],
  },
  {
    id: 'advocacy',
    title: 'Environmental Advocacy',
    subtitle:
      'Advancing sustainable policy, public awareness, and community action for lasting environmental impact.',
    items: [
      {
        title: 'Policy & Stakeholder Engagement',
        description: 'Work with local governments and organizations to shape waste policies and regulations.',
      },
      {
        title: 'Public Awareness Campaigns',
        description: 'Educate communities on sustainable practices through events, media, and outreach.',
      },
      {
        title: 'Community Partnership Programs',
        description: 'Collaborate with schools, businesses, and NGOs to drive collective environmental action.',
      },
    ],
  },
  {
    id: 'innovation',
    title: 'Green Innovation Incubation',
    subtitle:
      'Supporting climate-focused startups and innovators with mentorship, technical guidance, and market access.',
    items: [
      {
        title: 'Startup Mentorship & Training',
        description: 'Guide new ventures with business planning, sustainability modeling, and product development.',
      },
      {
        title: 'Access to Funding & Networks',
        description: 'Connect innovators with investors, partners, and ecosystem support.',
      },
      {
        title: 'Pilot & Scale Programs',
        description: 'Validate and scale green solutions through pilot implementations and field testing.',
      },
    ],
  },
  {
    id: 'education',
    title: 'Education & Community Engagement',
    subtitle:
      'Awareness campaigns, training, and community programs that drive lasting sustainable behavior.',
    items: [
      {
        title: 'Environmental Training Programs',
        description: 'Workshops and sessions to equip communities with practical waste management skills.',
      },
      {
        title: 'Youth & Volunteer Empowerment',
        description: 'Mobilize and train volunteers to lead local waste reduction initiatives.',
      },
      {
        title: 'Community Clean-Up Drives',
        description: 'Organize large-scale cleanups to restore public spaces and build civic pride.',
      },
    ],
  },
];

export default function ServicesCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section id="services" className="bg-muted py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16 text-center">
          <span className="inline-block px-3 sm:px-4 py-2 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            What We Offer
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our core service pillars designed to help organizations and communities thrive through training, technology, and sustainability.
          </p>
        </div>

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
                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 h-full flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4 flex-1">
                    {service.items.map((item) => (
                      <li key={item.title} className="flex gap-3">
                        <span className="mt-1 text-accent">
                          <CheckCircle2 size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
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
