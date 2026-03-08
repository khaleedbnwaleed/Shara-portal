'use client'

import { useState } from 'react'
import NextImage from '@/components/NextImage'
import Link from 'next/link'
import { Box, CheckCircle2, ClipboardList, LayoutDashboard, Menu, Users, X } from 'lucide-react'

type DashboardShellProps = {
  user: { name: string; avatar?: string | null }
  children: React.ReactNode
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const userInitial = user.name?.[0]?.toUpperCase() ?? ''

  const nav = (
    <aside className="w-72 flex flex-col bg-sidebar text-sidebar-foreground shadow-lg">
      <div className="flex h-20 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="Your avatar" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="text-base font-semibold text-primary">
                {userInitial}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground">Welcome</p>
            <p className="text-sm font-bold text-sidebar-foreground/90">{user.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          <Users className="h-4 w-4" />
          Profile
        </Link>
        <Link
          href="/dashboard/booking"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          <ClipboardList className="h-4 w-4" />
          Bookings
        </Link>
        <Link
          href="/dashboard/request-bin"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          <Box className="h-4 w-4" />
          Request Bin
        </Link>
        <Link
          href="/dashboard/volunteer"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" />
          Volunteers
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar p-3">
            {user.avatar ? (
              <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt="Your avatar" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                {userInitial}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/80">View profile</p>
            </div>
          </div>

          <form action="/api/auth/logout" method="post" className="mt-4">
            <button
              type="submit"
              className="w-full rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90 transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
      </nav>
    </aside>
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          {nav}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsMobileNavOpen(false)}
          />
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-7xl">
        <div className="hidden lg:flex">{nav}</div>
        <div className="flex-1 px-4 py-10 lg:px-10">{children}</div>
      </div>
    </main>
  )
}
