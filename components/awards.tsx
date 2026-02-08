 'use client'

import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel'

const awards = [
  {
    title: 'Winners of Initiative for Impact (I4I) Business Competition',
    year: 'Jigawa State - 2025',
    image: '/asset/image/10.jpg',
  },
  {
    title: 'Ideas and Data Global Excellence Award',
    year: 'Katsina State - 2023',
    image: '/asset/image/11.jpg',
  },
  {
    title: 'Sustainable Innovation Prize',
    year: '2022',
    image: '/asset/image/12.jpg',
  },
]

export default function Awards() {
  return (
    <section id="awards" className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold">Awards & Achievements</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            Recognitions for our work in sustainable waste management and community empowerment.
          </p>
        </div>

        <Carousel>
          <CarouselContent className="flex items-stretch">
            {awards.map((a) => (
              <CarouselItem key={a.title}>
                <div className="p-4 min-h-[220px] flex flex-col md:flex-row items-center gap-6 bg-white rounded-lg shadow-sm border">
                  <div className="w-full md:w-1/3 h-48 md:h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {/* Image holder: using a sample image from public/asset/image. Replace as needed. */}
                    <Image
                      src={a.image}
                      alt={a.title}
                      width={400}
                      height={240}
                      className="object-cover w-full h-full"
                      placeholder="empty"
                    />
                  </div>

                  <div className="w-full md:w-2/3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{a.title}</h3>
                      <span className="text-sm text-muted-foreground">{a.year}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Awarded for outstanding contribution to sustainable practices and community development.
                    </p>
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
  )
}
