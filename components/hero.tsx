'use client';

import Image from '@/components/NextImage';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      {/* Background Image */}
      <Image
        src="/asset/image/00.jpg"
        alt="Waste management background"
        fill
        className="absolute inset-0 object-cover z-0"
        priority
        quality={75}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 w-full h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-5 sm:space-y-7 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Empowering Responsible Waste Management
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join us in transforming waste into valuable resources. Tech-driven solutions for a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base min-h-12"
                >
                  Get Started
                  <ArrowRight size={18} className="hidden sm:block" />
                </Link>
                <Link
                  href="/volunteer"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/40 text-sm sm:text-base min-h-12 flex items-center justify-center"
                >
                  Become Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
