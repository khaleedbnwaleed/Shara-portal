import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default async function EcosystemSuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const params = await searchParams
  return (
    <main className="min-h-screen bg-[#f3f8ef]">
      <Header />
      <section className="flex min-h-[calc(100vh-80px)] items-center px-4 py-16">
        <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-[#37761d]/10 bg-white p-8 text-center shadow-xl sm:p-12">
          <CheckCircle2 className="mx-auto text-[#37761d]" size={72} strokeWidth={1.5} />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-[#37761d]">Registration successful</p>
          <h1 className="mt-3 text-3xl font-black text-[#123902] sm:text-5xl">Your climate solution is on the map.</h1>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">Thank you for joining Shara&apos;s Climate Tech Ecosystem Mapping. Your submission has been received and will support a stronger green innovation network across Jigawa State.</p>
          {params.ref && <div className="mx-auto mt-7 max-w-sm rounded-xl bg-[#edf5e8] px-4 py-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Registration reference</p><p className="mt-1 font-mono font-black text-[#123902]">{params.ref}</p></div>}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/ecosystem" className="rounded-xl border border-[#37761d] px-6 py-3 font-bold text-[#37761d]">Back to ecosystem</Link><Link href="/" className="rounded-xl bg-[#37761d] px-6 py-3 font-bold text-white">Return home</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
