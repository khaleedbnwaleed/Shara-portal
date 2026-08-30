import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FellowshipApplicationForm } from '@/components/fellowship/FellowshipApplicationForm'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = { title: 'Apply | Shara Climate Champions Fellowship', description: 'Complete your Shara Climate Champions Fellowship application.' }

export default function FellowshipApplyPage() {
  return <main className="min-h-screen bg-background text-foreground"><Header /><div className="px-4 py-10 sm:px-6 md:px-10 md:py-16"><div className="mx-auto mb-10 max-w-4xl"><Link href="/fellowship" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to fellowship</Link><p className="text-sm font-bold uppercase tracking-[.2em] text-accent-foreground">Climate Champions Fellowship · 2026</p><h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">Your application starts here.</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Take your time and answer in your own voice. Your progress stays on this page while you move between the six steps.</p></div><FellowshipApplicationForm /></div><Footer /></main>
}