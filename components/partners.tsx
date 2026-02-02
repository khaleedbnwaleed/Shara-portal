'use client';

import Image from 'next/image';

export default function Partners() {
  const partners = [
    '/asset/image/20.png',
    '/asset/image/21.png',
    '/asset/image/22.png',
    '/asset/image/23.png',
  ];

  return (
    <section className="bg-secondary py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm font-semibold text-primary mb-6 sm:mb-8 uppercase">
          Trusted Partners
        </p>
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
