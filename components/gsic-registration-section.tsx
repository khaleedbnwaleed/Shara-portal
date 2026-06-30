'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Award, BookOpen, CheckCircle2, Clock3, Leaf, Mail, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FormState = {
  schoolName: string
  schoolType: string
  schoolAddress: string
  teacherName: string
  teacherPhone: string
  teacherEmail: string
  studentOne: string
  studentTwo: string
  studentThree: string
  projectFocus: string
  projectIdea: string
  termsAccepted: boolean
}

const initialState: FormState = {
  schoolName: '',
  schoolType: 'Public',
  schoolAddress: 'Dutse LGA',
  teacherName: '',
  teacherPhone: '',
  teacherEmail: '',
  studentOne: '',
  studentTwo: '',
  studentThree: '',
  projectFocus: 'Waste Management & Recycling',
  projectIdea: '',
  termsAccepted: false,
}

const deadline = new Date('2026-07-12T23:59:59')
const projectFocusOptions = [
  'Waste Management & Recycling',
  'Waste-to-Wealth Innovations',
  'Tree Planting & School Beautification',
  'Hygiene & Sanitation',
  'Climate Change Awareness',
  'Environmental Technology & Creativity',
]

function getTimeRemaining() {
  const difference = deadline.getTime() - new Date().getTime()
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export function GsicRegistrationSection() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      setCountdown(getTimeRemaining())
    }

    tick()
    const timer = window.setInterval(tick, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const countdownItems = useMemo(
    () => [
      { label: 'Days', value: countdown.days },
      { label: 'Hours', value: countdown.hours },
      { label: 'Minutes', value: countdown.minutes },
      { label: 'Seconds', value: countdown.seconds },
    ],
    [countdown],
  )

  function validateForm() {
    const nextErrors: Record<string, string> = {}

    if (!form.schoolName.trim()) nextErrors.schoolName = 'School name is required.'
    if (!form.schoolAddress.trim()) nextErrors.schoolAddress = 'School address is required.'
    if (!form.teacherName.trim()) nextErrors.teacherName = 'Teacher mentor name is required.'
    if (!form.teacherPhone.trim()) nextErrors.teacherPhone = 'Phone number is required.'
    else if (!/^\+?[0-9\s-]{7,15}$/.test(form.teacherPhone)) nextErrors.teacherPhone = 'Enter a valid phone number.'
    if (!form.teacherEmail.trim()) nextErrors.teacherEmail = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.teacherEmail)) nextErrors.teacherEmail = 'Enter a valid email address.'
    if (!form.studentOne.trim()) nextErrors.studentOne = 'Student 1 details are required.'
    if (!form.studentTwo.trim()) nextErrors.studentTwo = 'Student 2 details are required.'
    if (!form.projectIdea.trim()) nextErrors.projectIdea = 'A project idea description is required.'
    if (!form.termsAccepted) nextErrors.termsAccepted = 'You must confirm the details before submitting.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage('')

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/gsic/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: form.schoolName.trim(),
          schoolType: form.schoolType,
          schoolAddress: form.schoolAddress.trim(),
          teacherName: form.teacherName.trim(),
          teacherPhone: form.teacherPhone.trim(),
          teacherEmail: form.teacherEmail.trim(),
          studentOne: form.studentOne.trim(),
          studentTwo: form.studentTwo.trim(),
          studentThree: form.studentThree.trim(),
          projectFocus: form.projectFocus,
          projectIdea: form.projectIdea.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'We could not save your application. Please try again.')
      }

      setSuccessMessage(`Application submitted successfully for ${form.schoolName.trim()}. Our team will contact you shortly.`)
      setForm(initialState)
      setErrors({})
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Submission failed.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,208,87,0.22),_transparent_30%),linear-gradient(135deg,_#052e16_0%,_#0f3d27_45%,_#14532d_100%)] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="w-full lg:max-w-[52%]">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-100/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
            <Leaf className="h-4 w-4" /> Green School Innovation Challenge
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Register for the Green School Innovation Challenge
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-emerald-50/90">
            Registration is open from 29th June – 12th July 2026. Don&apos;t miss the 2-week window!
          </p>

          <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-amber-200">
              <Clock3 className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.24em]">Deadline countdown</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {countdownItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-emerald-950/70 p-4 text-center">
                  <p className="text-3xl font-black text-white">{String(item.value).padStart(2, '0')}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Free scholarship', text: 'Selected teams can receive full support for their innovation journey.' },
              { icon: Award, title: 'Prizes', text: 'Win exciting recognition and practical rewards for standout ideas.' },
              { icon: BookOpen, title: 'Certification', text: 'Every participant receives a certificate of participation.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <Icon className="h-6 w-6 text-amber-300" />
                  <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-emerald-50/80">{item.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full lg:max-w-[48%]">
          <div className="rounded-[2rem] border border-emerald-100/20 bg-[#f9f7eb] p-5 text-slate-800 shadow-2xl sm:p-7 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-emerald-950">Application / Registration</h2>
              <p className="mt-2 text-sm text-slate-600">
                Complete the form below to register your school team for the Dutse edition.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">School Name</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-emerald-600"
                    placeholder="e.g. Government Secondary School Dutse"
                    value={form.schoolName}
                    onChange={(event) => setForm({ ...form, schoolName: event.target.value })}
                  />
                  {errors.schoolName && <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">School Type</label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    value={form.schoolType}
                    onChange={(event) => setForm({ ...form, schoolType: event.target.value })}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">School Address (Dutse LGA)</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  placeholder="Enter the school address"
                  value={form.schoolAddress}
                  onChange={(event) => setForm({ ...form, schoolAddress: event.target.value })}
                />
                {errors.schoolAddress && <p className="mt-1 text-sm text-red-600">{errors.schoolAddress}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Teacher Mentor Full Name</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    placeholder="Full name"
                    value={form.teacherName}
                    onChange={(event) => setForm({ ...form, teacherName: event.target.value })}
                  />
                  {errors.teacherName && <p className="mt-1 text-sm text-red-600">{errors.teacherName}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Teacher Mentor Phone Number</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    placeholder="08000000000"
                    value={form.teacherPhone}
                    onChange={(event) => setForm({ ...form, teacherPhone: event.target.value })}
                  />
                  {errors.teacherPhone && <p className="mt-1 text-sm text-red-600">{errors.teacherPhone}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Teacher Mentor Email</label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  placeholder="mentor@email.com"
                  value={form.teacherEmail}
                  onChange={(event) => setForm({ ...form, teacherEmail: event.target.value })}
                />
                {errors.teacherEmail && <p className="mt-1 text-sm text-red-600">{errors.teacherEmail}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Student 1 Full Name & Class</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    placeholder="Name, Class"
                    value={form.studentOne}
                    onChange={(event) => setForm({ ...form, studentOne: event.target.value })}
                  />
                  {errors.studentOne && <p className="mt-1 text-sm text-red-600">{errors.studentOne}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Student 2 Full Name & Class</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    placeholder="Name, Class"
                    value={form.studentTwo}
                    onChange={(event) => setForm({ ...form, studentTwo: event.target.value })}
                  />
                  {errors.studentTwo && <p className="mt-1 text-sm text-red-600">{errors.studentTwo}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Student 3 Full Name & Class (optional)</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  placeholder="Name, Class"
                  value={form.studentThree}
                  onChange={(event) => setForm({ ...form, studentThree: event.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Project Focus Area</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  value={form.projectFocus}
                  onChange={(event) => setForm({ ...form, projectFocus: event.target.value })}
                >
                  {projectFocusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Brief Project Idea Description</label>
                <textarea
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  placeholder="Describe your green innovation idea in a few sentences"
                  value={form.projectIdea}
                  onChange={(event) => setForm({ ...form, projectIdea: event.target.value })}
                />
                {errors.projectIdea && <p className="mt-1 text-sm text-red-600">{errors.projectIdea}</p>}
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.termsAccepted}
                  onChange={(event) => setForm({ ...form, termsAccepted: event.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span>
                  I confirm all details are accurate and agree to the programme terms.
                </span>
              </label>
              {errors.termsAccepted && <p className="text-sm text-red-600">{errors.termsAccepted}</p>}

              {successMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5" />
                    <span>{successMessage}</span>
                  </div>
                </div>
              ) : null}

              {errors.submit ? <p className="text-sm text-red-600">{errors.submit}</p> : null}

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-2xl bg-emerald-700 px-6 py-6 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>

            <div className="mt-7 space-y-3 rounded-3xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-emerald-950">Eligibility</p>
                  <p>Public & Private secondary schools in Dutse LGA.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-emerald-950">Team Composition</p>
                  <p>1–3 students and 1 teacher mentor.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-emerald-950">Contact</p>
                  <p>08169525295, 08036011765</p>
                  <a href="mailto:sharaclimateacademy@gmail.com" className="font-medium text-emerald-700 underline">
                    sharaclimateacademy@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-semibold text-emerald-950">Need help?</p>
                  <p>Our team is ready to support your application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
