import Link from 'next/link'
import { CheckCircle2, ExternalLink, Leaf, Share2 } from 'lucide-react'
import { CopyApplicationIdButton } from '@/components/fellowship/CopyApplicationIdButton'

export default async function FellowshipSuccessPage({ searchParams }: { searchParams: Promise<{ applicationId?: string }> }) {
  const { applicationId } = await searchParams
  const shareText = encodeURIComponent(`I just applied for the Shara Climate Champions Fellowship! Join me in learning, leading and taking climate action. ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.shara.com.ng/fellowship'}`)

  if (!applicationId) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7faf4] px-5 py-10 text-center text-[#17351f]">
        <div className="max-w-md">
          <h1 className="text-3xl font-black text-[#164d2b]">Application details unavailable</h1>
          <p className="mt-4 leading-7 text-[#65796a]">We could not find a submitted application ID. Please return to the application page and submit again.</p>
          <Link href="/fellowship/apply" className="mt-7 inline-flex rounded-xl bg-[#164d2b] px-5 py-3 font-extrabold text-white">Return to application</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7faf4] px-5 py-10 text-[#17351f] md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/fellowship" className="flex items-center gap-3 font-extrabold text-[#164d2b]"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#164d2b] text-[#f5cc55]"><Leaf size={20} /></span>Shara Climate Academy</Link>
        <div className="mt-14 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#dff0d9] text-[#2f7b45]"><CheckCircle2 size={42} /></div><p className="mt-7 text-sm font-bold uppercase tracking-[.2em] text-[#c18f1d]">Application received</p><h1 className="mt-3 text-4xl font-black text-[#164d2b] md:text-5xl">Application submitted successfully.</h1><p className="mx-auto mt-5 max-w-lg leading-7 text-[#65796a]">Thank you for applying to the Shara Climate Champions Fellowship. Our team will review applications and contact shortlisted candidates.</p></div>
        <div className="mt-10 rounded-3xl border border-[#b8d6aa] bg-white p-7 text-center shadow-[0_18px_50px_rgba(22,77,43,.06)]"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#53745a]">Your application ID</p><p className="mt-3 font-mono text-3xl font-black tracking-wide text-[#164d2b]">{applicationId}</p><p className="mt-3 text-sm text-[#65796a]">Please save this ID for future reference.</p><CopyApplicationIdButton applicationId={applicationId} /></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3"><a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#164d2b] px-4 py-3 text-sm font-extrabold text-white"><Share2 size={16} /> Share fellowship</a><Link href="/fellowship/status" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c8d9c3] bg-white px-4 py-3 text-sm font-extrabold text-[#31543b]">Track status <ExternalLink size={16} /></Link><Link href="/fellowship" className="inline-flex items-center justify-center rounded-xl border border-[#c8d9c3] bg-white px-4 py-3 text-sm font-extrabold text-[#31543b]">Return home</Link></div>
      </div>
    </main>
  )
}
