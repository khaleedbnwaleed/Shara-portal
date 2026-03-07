import { LucideIcon } from 'lucide-react'

type StatCardProps = {
  icon: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  className?: string
}

export default function StatCard({ icon: Icon, title, value, subtitle, className }: StatCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className ?? ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        </div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {subtitle ? <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}
