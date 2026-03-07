'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { format, subMonths, parseISO } from 'date-fns'

type BinRequest = { created_at: string }

function getMonthlyData(binRequests: BinRequest[]) {
  const now = new Date()
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = subMonths(now, 5 - index)
    const key = format(date, 'yyyy-MM')
    return {
      label: format(date, 'MMM'),
      key,
      count: 0,
    }
  })

  const counts = binRequests.reduce<Record<string, number>>((acc, request) => {
    const monthKey = format(parseISO(request.created_at), 'yyyy-MM')
    acc[monthKey] = (acc[monthKey] ?? 0) + 1
    return acc
  }, {})

  return months.map((month) => ({
    name: month.label,
    requests: counts[month.key] ?? 0,
  }))
}

export default function BinRequestChart({ binRequests }: { binRequests: BinRequest[] }) {
  const data = getMonthlyData(binRequests)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Bin requests this year</p>
          <p className="text-xs text-muted-foreground">Monthly totals</p>
        </div>
      </div>

      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="requests" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
