import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminUserFromSession } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { fellowshipStatuses } from '@/lib/fellowship'

async function requireAdmin() { return getAdminUserFromSession((await cookies()).get('session')?.value) }

export async function GET(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const search = request.nextUrl.searchParams
  const format = search.get('format')
  const applicants = await prisma.fellowshipApplicant.findMany({ orderBy: { createdAt: 'desc' } })
  if (format === 'csv') {
    const headers = ['Application ID', 'Name', 'Email', 'Phone', 'State', 'Gender', 'Education', 'Status', 'Score', 'Created']
    const rows = applicants.map((item) => [item.applicationId, item.fullName, item.email, item.phone, item.state, item.gender, item.education, item.status, item.score ?? '', item.createdAt.toISOString()])
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="shara-climate-champions-applications.csv"' } })
  }
  return NextResponse.json({ applicants })
}

const updateSchema = z.object({ applicationId: z.string(), status: z.enum(fellowshipStatuses).optional(), reviewerNotes: z.string().max(5000).optional(), scores: z.object({ motivation: z.number().min(0).max(20), climate: z.number().min(0).max(20), leadership: z.number().min(0).max(20), impact: z.number().min(0).max(20), innovation: z.number().min(0).max(10), communication: z.number().min(0).max(10) }).optional() })

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(); if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = updateSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'Invalid review update.' }, { status: 400 })
  const { applicationId, status, reviewerNotes, scores } = parsed.data
  const score = scores ? Object.values(scores).reduce((total, value) => total + value, 0) : undefined
  const applicant = await prisma.fellowshipApplicant.update({ where: { applicationId }, data: { ...(status ? { status } : {}), ...(reviewerNotes !== undefined ? { reviewerNotes } : {}), ...(score !== undefined ? { score } : {}) } })
  if (scores) {
    const reviewer = await prisma.fellowshipReviewer.upsert({
      where: { email: admin.email },
      create: { name: admin.name, email: admin.email, role: 'Administrator' },
      update: { name: admin.name },
    })
    await prisma.fellowshipReview.create({
      data: {
        applicationId: applicant.id,
        reviewerId: reviewer.id,
        motivationScore: scores.motivation,
        climateScore: scores.climate,
        leadershipScore: scores.leadership,
        impactScore: scores.impact,
        innovationScore: scores.innovation,
        communicationScore: scores.communication,
        totalScore: score ?? 0,
        notes: reviewerNotes,
      },
    })
  }
  return NextResponse.json({ ok: true, applicant: { applicationId: applicant.applicationId, status: applicant.status, score: applicant.score } })
}

const settingsSchema = z.object({ title: z.string().min(2), duration: z.string().min(2), format: z.string().min(2), contactEmail: z.string().email(), applicationOpen: z.boolean(), description: z.string().min(2), maxApplications: z.number().int().positive().nullable().optional() })

export async function PUT(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = settingsSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'Invalid settings.' }, { status: 400 })
  const settings = await prisma.fellowshipSettings.upsert({ where: { id: 1 }, create: { id: 1, ...parsed.data }, update: parsed.data })
  return NextResponse.json({ ok: true, settings })
}