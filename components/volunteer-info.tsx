import { HeartHandshake, Sparkles, Users } from 'lucide-react'

export default function VolunteerInfo() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Join our Volunteer Community
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Make a difference by sharing your time, skills, and energy with Shara's
            community programs. Whether you support outreach, operations, or tech innovation,
            your contribution helps drive lasting impact.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-full bg-green-50 p-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Connect with community</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Join a network of changemakers and work alongside local leaders toward cleaner,
              healthier neighborhoods.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-50 p-4">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Grow your skills</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Gain hands-on experience in sustainability, project coordination, data analysis,
              and community outreach.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-full bg-amber-50 p-4">
              <HeartHandshake className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">Be part of the impact</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Help us scale sustainable waste solutions and empower communities to thrive.
              Every hour you contribute shapes a cleaner future.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
