'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServicesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const services = [
    {
      id: 1,
      image: '/asset/image/cardimage/image1.jpeg',
      title: 'Garbage Pickup',
      description: 'Convenient recycling solutions for plastics, paper, and metals.',
    },
    {
      id: 2,
      image: '/asset/image/cardimage/image2.jpeg',
      title: 'Residential Recycling',
      description: 'Flexible dumpster options for construction, events, and bulk waste disposal.',
    },
    {
      id: 3,
      image: '/asset/image/cardimage/image3.jpeg',
      title: 'Dumpster Rental',
      description: 'Quick and easy dumpster rental solutions for all your waste needs.',
    },
    {
      id: 4,
      image: '/asset/image/cardimage/image4.jpeg',
      title: 'Junk Removal',
      description: 'Efficient removal of unwanted items, old furniture, and non-hazardous waste.',
    },
    {
      id: 5,
      image: '/asset/image/cardimage/image5.jpeg',
      title: 'Secure Destruction',
      description: 'Safe disposal of confidential documents and sensitive materials.',
    },
    {
      id: 6,
      image: '/asset/image/cardimage/image6.jpeg',
      title: 'Waste Recycling',
      description: 'Eco-friendly processing of waste into reusable materials and resources.',
    },
  ];

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoplay, services.length]);

  const goToSlide = (index) => {
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
        <div className="mb-12">
          <p className="text-accent text-sm font-bold uppercase mb-2">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Waste Management Solutions Tailored to You
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Main Slide */}
          <div className="relative overflow-hidden rounded-2xl h-96 md:h-[500px]">
            <Image
              src={services[currentSlide].image || "/placeholder.svg"}
              alt={services[currentSlide].title}
              fill
              quality={70}
              className="object-cover transition-opacity duration-500"
            />

            {/* Caption Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {services[currentSlide].title}
              </h3>
              <p className="text-lg text-gray-200 max-w-lg">
                {services[currentSlide].description}
              </p>
            </div>
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
