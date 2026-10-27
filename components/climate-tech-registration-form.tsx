'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const LGAS = ['Auyo','Babura','Biriniwa','Birnin Kudu','Buji','Dutse','Gagarawa','Garki','Gumel','Guri','Gwaram','Gwiwa','Hadejia','Jahun','Kafin Hausa','Kaugama','Kazaure','Kiri Kasamma','Kiyawa','Maigatari','Malam Madori','Miga','Ringim','Roni','Sule Tankarkar','Taura','Yankwashi']
const categories = ['Climate-Tech Startups & Innovators','Renewable Energy Solutions','Waste Management & Recycling','Climate-Smart Agriculture & Livestock','Environmental Organisations & NGOs','Green Businesses & Circular Economy','Climate Education & Advocacy','Water, Sanitation & Environmental Tech']

export default function ClimateTechRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/climate-tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.error || 'Registration failed. Please try again.')
      router.push(`/ecosystem/success?ref=${encodeURIComponent(result.registrationRef)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#37761d] focus:ring-4 focus:ring-[#37761d]/10'

  return (
    <form id="register" onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 shadow-2xl sm:p-8">
      <div className="mb-7">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#37761d]">Ecosystem registration</p>
        <h2 className="text-2xl font-black text-[#123902] sm:text-3xl">Add your climate solution</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Tell us about your organisation or initiative so it can be mapped across Jigawa State.</p>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Organisation / project name *<input required name="organisationName" className={inputClass} placeholder="e.g. Green Energy Initiative" /></label>
        <label className="text-sm font-bold text-slate-700">Organisation type *<select required name="organisationType" defaultValue="" className={inputClass}><option value="" disabled>Select type</option><option>Startup / Innovation</option><option>Registered Business</option><option>NGO / Non-profit</option><option>Community Group</option><option>Government Agency</option><option>Academic Institution</option><option>Individual Innovator</option></select></label>
        <label className="text-sm font-bold text-slate-700">Contact person *<input required name="contactName" className={inputClass} placeholder="Full name" /></label>
        <label className="text-sm font-bold text-slate-700">Email address *<input required type="email" name="email" className={inputClass} placeholder="name@example.com" /></label>
        <label className="text-sm font-bold text-slate-700">Phone number *<input required type="tel" name="phone" className={inputClass} placeholder="+234" /></label>
        <label className="text-sm font-bold text-slate-700">Website (optional)<input type="url" name="website" className={inputClass} placeholder="https://" /></label>
        <label className="text-sm font-bold text-slate-700">Climate-tech category *<select required name="category" defaultValue="" className={inputClass}><option value="" disabled>Select category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="text-sm font-bold text-slate-700">LGA *<select required name="lga" defaultValue="" className={inputClass}><option value="" disabled>Select LGA</option>{LGAS.map((lga) => <option key={lga}>{lga}</option>)}</select></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">Project address / location<input name="address" className={inputClass} placeholder="Town, community or street address" /></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">Current stage *<select required name="stage" defaultValue="" className={inputClass}><option value="" disabled>Select stage</option><option>Idea / Concept</option><option>Prototype / Pilot</option><option>Early-stage / Operating</option><option>Scaling / Established</option></select></label>
        <label className="text-sm font-bold text-slate-700 sm:col-span-2">About the solution *<textarea required name="description" rows={5} className={inputClass} placeholder="Describe the problem you address, your solution, and the communities or impact area you serve." /></label>
      </div>

      <button disabled={loading} type="submit" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#37761d] px-6 py-3 font-black text-white transition hover:bg-[#123902] disabled:cursor-not-allowed disabled:opacity-70">
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading ? 'Submitting registration...' : 'Register on the Climate Tech Map'}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">By registering, you confirm that the information provided is accurate.</p>
    </form>
  )
}
