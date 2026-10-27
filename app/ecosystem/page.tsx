import Link from 'next/link'
import { BookOpen, BriefcaseBusiness, Droplets, Lightbulb, Recycle, Sprout, Sun, Users } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ClimateTechRegistrationForm from '@/components/climate-tech-registration-form'
import NextImage from '@/components/NextImage'

export const metadata = { title: 'Shara Climate Tech Mapping | Jigawa State', description: 'Map and connect climate innovators, organisations, startups and green enterprises across Jigawa State.' }

const categories = [
  { icon: Lightbulb, label: 'Climate-Tech Startups & Innovators' }, { icon: Sun, label: 'Renewable Energy Solutions' },
  { icon: Recycle, label: 'Waste Management & Recycling' }, { icon: Sprout, label: 'Climate-Smart Agriculture & Livestock' },
  { icon: Users, label: 'Environmental Organisations & NGOs' }, { icon: BriefcaseBusiness, label: 'Green Businesses & Circular Economy' },
  { icon: BookOpen, label: 'Climate Education & Advocacy' }, { icon: Droplets, label: 'Water, Sanitation & Environmental Tech' },
]

export default function EcosystemPage() {
  return (
    <main className="min-h-screen bg-[#061f27] text-white">
      <Header />
      <section className="bg-[#eef5e9] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <a href="#register" className="block overflow-hidden rounded-[2rem] bg-white shadow-xl transition-transform hover:scale-[1.01]" aria-label="Register your climate solution">
              <NextImage src="/asset/image/flyer.png" alt="Shara Climate Tech Ecosystem Mapping registration flyer" width={2159} height={1957} className="h-auto w-full object-cover" priority />
            </a>
            <div className="mt-4 rounded-2xl bg-white p-6 text-[#123902] shadow-lg"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#37761d]">Contact</p><a className="mt-2 block font-black" href="mailto:sharaecosolutions@gmail.com">sharaecosolutions@gmail.com</a><a className="mt-2 block font-black" href="tel:+2348169525295">+234 816 952 5295</a><a className="mt-2 block font-black" href="https://shara.com.ng">shara.com.ng</a></div>
          </div>
          <ClimateTechRegistrationForm />
        </div>
      </section>

      <div className="bg-[#fbbf24] px-4 py-6 text-center"><p className="text-xl font-black text-[#123902] sm:text-3xl">LET&apos;S MAP JIGAWA&apos;S GREEN FUTURE!</p></div>
      <Footer />
    </main>
  )
}
