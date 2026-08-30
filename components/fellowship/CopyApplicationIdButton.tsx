'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyApplicationIdButton({ applicationId }: { applicationId: string }) {
  const [copied, setCopied] = useState(false)

  async function copyApplicationId() {
    await navigator.clipboard?.writeText(applicationId)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button type="button" onClick={copyApplicationId} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#c8d9c3] px-4 py-3 text-sm font-bold text-[#31543b]">
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Copied' : 'Copy application ID'}
    </button>
  )
}
