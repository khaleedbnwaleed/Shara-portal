import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shara Eco Solutions | Sustainable Waste Management',
  description: 'Tech-driven waste management and recycling solutions for a sustainable future. Curbside collection, dumpster rental, and e-waste recycling.',
  generator: 'v0.app',
  // Mobile optimization
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  // SEO and performance
  themeColor: '#37761d',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: [
      {
        url: '/asset/image/sharaa-03.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/asset/image/sharaa-03.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
