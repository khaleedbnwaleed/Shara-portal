import Link from 'next/link'
import { ArrowLeft, Clock3 } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export const metadata = { title: 'Applications Closed | Shara Climate Champions Fellowship', description: 'Applications for the Shara Climate Champions Fellowship are currently closed.' }

export default function FellowshipApplyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="px-4 py-10 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <Link href="/fellowship" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-[#2d5e1d]">
            <ArrowLeft size={16} /> Back to fellowship
          </Link>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
            <Clock3 size={22} />
          </div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[.2em] text-[#5f7b40]">Applications closed</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-primary md:text-5xl">The fellowship application is currently closed.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">Thank you for your interest in the Shara Climate Champions Fellowship. Please follow Shara Climate Academy for future opportunities and upcoming cohort announcements.</p>
        </div>
      </div>
      <Footer />
    </main>
  )
}