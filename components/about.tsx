'use client';

import Image from 'next/image';

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Image */}
          <div className="order-2 md:order-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PXL_20251025_082419643.RAW-01.COVER-ny7M9TLQWTB2cxXaN8o4wB9BcgwpMJ.jpg"
              alt="Shara Eco Solutions team conducting community waste cleanup and recycling initiative"
              width={500}
              height={400}
              loading="lazy"
              quality={75}
              className="rounded-2xl w-full object-cover shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div className="order-1 md:order-2 space-y-6">
            <div>
              <span className="text-xs sm:text-sm font-bold text-accent uppercase">About Us</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-2">
                Shara Eco Solutions Ltd
              </h2>
            </div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              <p>
                A tech-driven waste management company committed to transforming waste into valuable, eco-friendly resources. Based in Nigeria, we leverage smart technology, AI-driven logistics, and recycling innovations.
              </p>

              <p>
                Our services include safe waste disposal, scheduled pickups, extensive recycling, and waste-to-energy solutions, ensuring efficient and environmentally responsible waste management.
              </p>

              <p>
                At Shara Eco Solutions, we believe waste is not a problem, but an opportunity. By integrating data analytics, satellite technology, and community engagement, we are driving a cleaner, greener future.
              </p>
            </div>

            <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-colors text-sm sm:text-base min-h-12 w-fit">
              Explore Our Impact
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
