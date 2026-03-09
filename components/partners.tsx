'use client';

import Image from '@/components/NextImage';

export default function Partners() {
  const partners = [
    '/asset/image/20.png',
    '/asset/image/21.png',
    '/asset/image/22.png',
    '/asset/image/23.png',
  ];

  return (
    <section className="bg-secondary py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-3 sm:px-4 py-2 bg-white text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Trusted Partners
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Working with Organizations That Share Our Vision
          </h2>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-12 sm:h-16 hover:scale-110 transition-all opacity-100 hover:opacity-90"
            >
              <Image
                src={partner || "/placeholder.svg"}
                alt={`Partner logo ${index + 1}`}
                width={150}
                height={60}
                className="max-h-12 sm:max-h-16 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
