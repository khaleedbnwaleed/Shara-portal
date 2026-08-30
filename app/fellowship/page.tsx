import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Globe2, Leaf, MessagesSquare, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import { getFellowshipConfig } from '@/lib/fellowship'
import Header from '@/components/header'
import Footer from '@/components/footer'

const highlights = [
  { icon: Leaf, title: 'Climate Education', text: 'Build practical knowledge of climate change, sustainability and environmental challenges.' },
  { icon: Sparkles, title: 'Green Innovation', text: 'Explore solutions that turn environmental challenges into opportunities for action.' },
  { icon: Globe2, title: 'Community Climate Action', text: 'Design and implement a practical climate-action initiative in your community.' },
  { icon: UsersRound, title: 'Leadership & Advocacy', text: 'Grow your communication, leadership and community engagement skills.' },
  { icon: MessagesSquare, title: 'Media & Information Literacy', text: 'Communicate climate issues clearly and help communities navigate misinformation.' },
]

const process = ['Complete your application', 'Applications are reviewed', 'Shortlisted applicants are contacted', 'Selected fellows begin the programme']

export const metadata = { title: 'Shara Climate Champions Fellowship', description: 'Apply to the Shara Climate Champions Fellowship.' }
export const dynamic = 'force-dynamic'

export default async function FellowshipPage() {
  const fellowshipConfig = await getFellowshipConfig()
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative overflow-hidden bg-[#164d2b] px-5 py-16 text-white md:px-10 md:py-24">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-36 border-[#2e7144] opacity-60" />
        <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-t-full border-18 border-[#245f39]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#8bb875]/40 bg-[#225f38] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#dceec8]"><span className="h-2 w-2 rounded-full bg-[#f5cc55]" /> Applications: {fellowshipConfig.applicationOpen ? 'Open' : 'Closed'}</div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#a9d18c]">Shara Climate Academy · An initiative of Shara Eco Solutions Ltd.</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[.95] tracking-tight md:text-7xl">Shara Climate<br /><span className="text-[#f5cc55]">Champions</span> Fellowship</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e2f0dc]">Be the Change. Lead the Future. Equip yourself with the knowledge, skills, networks and opportunities to become an effective climate leader and community change-maker.</p>
            {!fellowshipConfig.applicationOpen && <p className="mt-5 max-w-xl rounded-xl border border-white/15 bg-white/10 p-4 text-sm font-semibold text-[#e2f0dc]">Applications for the Shara Climate Champions Fellowship are currently closed. Follow Shara Climate Academy for future opportunities.</p>}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">{fellowshipConfig.applicationOpen ? <Link href="/fellowship/apply" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5cc55] px-7 py-4 font-extrabold text-[#17351f] hover:bg-[#e6b93d]">Apply now <ArrowRight size={18} /></Link> : <span className="inline-flex items-center justify-center rounded-full bg-white/15 px-7 py-4 font-extrabold text-white">Applications closed</span>}<Link href="#programme" className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-bold text-white hover:bg-white/10">Explore the fellowship</Link></div>
          </div>
          <div className="rounded-4xl border border-white/15 bg-[#0f3d22]/70 p-7 backdrop-blur"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#a9d18c]">Your climate leadership journey</p><div className="mt-8 space-y-6">{[['01', 'Learn', 'Build a strong climate foundation'], ['02', 'Lead', 'Turn ideas into community action'], ['03', 'Impact', 'Join a network shaping tomorrow']].map(([number, title, text]) => <div key={number} className="flex gap-4"><span className="font-mono text-sm text-[#f5cc55]">{number}</span><div><p className="font-bold">{title}</p><p className="mt-1 text-sm text-[#c7dfbd]">{text}</p></div></div>)}</div></div>
        </div>
      </section>

      <section id="programme" className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#c18f1d]">Designed for action</p><h2 className="mt-3 text-4xl font-black tracking-tight text-[#164d2b] md:text-5xl">A fellowship for young people ready to move.</h2><p className="mt-5 text-lg leading-8 text-[#5b7261]">The fellowship combines learning, peer connection and practical community action. You will leave with a clearer voice, a stronger network and a project you can be proud of.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{highlights.map(({ icon: Icon, title, text }, index) => <article key={title} className={`rounded-3xl border p-6 ${index === 0 ? 'border-[#b8d6aa] bg-[#e8f3e2]' : 'border-[#d9e7d4] bg-white'}`}><Icon className="text-[#2f7b45]" size={25} /><h3 className="mt-8 font-extrabold text-[#164d2b]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#65796a]">{text}</p></article>)}</div></section>

      <section id="process" className="border-y border-[#d9e7d4] bg-white px-5 py-16 md:px-10 md:py-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#c18f1d]">Simple by design</p><h2 className="mt-3 text-4xl font-black text-[#164d2b]">From application to action.</h2><p className="mt-5 leading-7 text-[#65796a]">No application fee. Set aside about 20 minutes and answer honestly. You can move between steps without losing your responses.</p></div><div className="grid gap-4 sm:grid-cols-2">{process.map((item, index) => <div key={item} className="flex gap-4 rounded-2xl bg-[#f7faf4] p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#164d2b] text-sm font-black text-[#f5cc55]">{index + 1}</span><p className="pt-1 font-bold text-[#31543b]">{item}</p></div>)}</div></div></section>

      <section className="bg-[#f5cc55] px-5 py-14 md:px-10"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-[#715510]">{fellowshipConfig.duration} · Blended programme</p><h2 className="mt-2 text-3xl font-black text-[#17351f] md:text-4xl">Your community needs your climate voice.</h2></div>{fellowshipConfig.applicationOpen && <Link href="/fellowship/apply" className="inline-flex items-center gap-2 rounded-full bg-[#164d2b] px-7 py-4 font-extrabold text-white hover:bg-[#0e3b20]">Start application <ArrowRight size={18} /></Link>}</div></section>

      <Footer />
    </main>
  )
}