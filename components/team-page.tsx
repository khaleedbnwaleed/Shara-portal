'use client';

import Image from '@/components/NextImage';
import { Linkedin, Twitter } from 'lucide-react';

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
};

export type TeamCategory = {
  title: string;
  description?: string;
  members: TeamMember[];
};

export default function TeamPage({ categories }: { categories: TeamCategory[] }) {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 sm:px-4 py-2 bg-secondary text-primary text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
            Our Team
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Meet the team driving Shara forward
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Our people are our strength. Learn about the Board of Directors, Core Team, Volunteers, and Ambassadors who power our mission.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category.title} className="mb-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                {category.title}
              </h2>
              {category.description ? (
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  {category.description}
                </p>
              ) : null}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                      <Image
                        src={member.image ?? '/asset/image/student.jpg'}
                        alt={member.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm font-medium text-accent/90 leading-relaxed">{member.role}</p>
                    </div>
                  </div>

                  {(member.social?.linkedin || member.social?.twitter) && (
                    <div className="mt-4 flex items-center gap-2">
                      {member.social?.linkedin ? (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                          aria-label={`LinkedIn profile for ${member.name}`}
                        >
                          <Linkedin size={16} />
                        </a>
                      ) : null}
                      {member.social?.twitter ? (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-blue-400 hover:text-white transition-colors"
                          aria-label={`Twitter profile for ${member.name}`}
                        >
                          <Twitter size={16} />
                        </a>
                      ) : null}

                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
