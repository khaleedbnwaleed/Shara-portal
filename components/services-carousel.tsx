'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServicesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const services = [
    {
      id: 1,
      title: 'Smart Waste Collection and Management',
      description: 'Structured and technology-driven waste collection services for residential estates, corporate organizations, schools, and government institutions. Includes scheduled waste pickup, waste segregation at source, and deployment of smart bins.',
    },
    {
      id: 2,
      title: 'Recycling and Resource Recovery',
      description: 'Promote circular economy practices by collecting, sorting, and processing recyclable materials such as plastics, paper, and metals. Convert waste into valuable resources through partnerships and buy-back initiatives.',
    },
    {
      id: 3,
      title: 'Environmental Consultancy and ESG Advisory',
      description: 'Professional environmental consultancy services including waste audits, sustainability assessments, environmental compliance advisory, and ESG reporting support for organizations.',
    },
    {
      id: 4,
      title: 'Climate and Environmental Education',
      description: 'Environmental awareness campaigns, school outreach programs, community sanitation initiatives, and youth empowerment training on climate action and sustainable practices.',
    },
    {
      id: 5,
      title: 'Organic Waste Conversion and Green Solutions',
      description: 'Convert organic waste into compost and environmentally friendly products. Support urban farming, soil restoration, and sustainable agricultural practices.',
    },
    {
      id: 6,
      title: 'Green Startup Incubation and Innovation Support',
      description: 'Support early-stage environmental and climate-focused startups through mentorship, training, and business development. Equip young entrepreneurs with technical knowledge and market access opportunities.',
    },
  ];

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoplay, services.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoplay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
    setIsAutoplay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    setIsAutoplay(false);
  };

  return (
    <section id="services" className="bg-neutral-dark text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-block px-3 sm:px-4 py-2 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Waste Management Solutions Tailored to You
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Main Slide */}
          <div className="relative overflow-hidden rounded-2xl h-auto md:h-auto bg-primary/10 p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-primary">
                {services[currentSlide].title}
            </h3>
            <p className="text-base md:text-lg text-foreground max-w-xl">
                {services[currentSlide].description}
            </p>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-3 rounded-full z-20 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-3 rounded-full z-20 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-accent w-8'
                  : 'bg-white/30 hover:bg-white/50 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
