import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { fellowshipApplicationSchema, generateFellowshipApplicationId, getFellowshipConfig } from '@/lib/fellowship'

export async function POST(request: NextRequest) {
  try {
    const parsed = fellowshipApplicationSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Please check your responses.' }, { status: 400 })
    }

    const data = parsed.data
    const email = data.email.toLowerCase()
    const dateOfBirth = new Date(data.dateOfBirth)
    if (Number.isNaN(dateOfBirth.getTime())) {
      return NextResponse.json({ ok: false, error: 'Please provide a valid date of birth.' }, { status: 400 })
    }
    const config = await getFellowshipConfig()
    if (!config.applicationOpen) {
      return NextResponse.json({ ok: false, error: 'Applications for this fellowship are currently closed.' }, { status: 403 })
    }
    if (config.maxApplications) {
      const applicationCount = await prisma.fellowshipApplicant.count()
      if (applicationCount >= config.maxApplications) {
        return NextResponse.json({ ok: false, error: 'The application limit for this fellowship has been reached.' }, { status: 403 })
      }
    }
    const existing = await prisma.fellowshipApplicant.findFirst({ where: { email } })
    if (existing) {
      return NextResponse.json({ ok: false, error: 'An application already exists for this email address.', applicationId: existing.applicationId }, { status: 409 })
    }

    let applicationId = generateFellowshipApplicationId()
    while (await prisma.fellowshipApplicant.findUnique({ where: { applicationId } })) {
      applicationId = generateFellowshipApplicationId(Date.now() + Math.floor(Math.random() * 1000))
    }

    const applicant = await prisma.fellowshipApplicant.create({
      data: {
        applicationId,
        fullName: data.fullName,
        email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth,
        age: data.age,
        state: data.state,
        lga: data.lga,
        community: data.community || null,
        country: data.country,
        address: data.address || null,
        education: data.education,
        fieldOfStudy: data.fieldOfStudy || null,
        institution: data.institution || null,
        occupation: data.occupation,
        organization: data.organization || null,
        role: data.role || null,
        climateExperience: data.hasClimateExperience === 'Yes' ? data.climateExperience || null : null,
        climateInterests: data.climateInterests,
        motivation: data.motivation,
        communityChallenge: data.communityChallenge,
        proposedImpact: data.proposedImpact,
        leadershipExperience: data.leadershipExperience,
        climateLeadership: data.climateLeadership,
        skills: data.skills,
        digitalLiteracy: data.digitalLiteracy,
        availability: data.availability,
        referralSource: data.referralSource,
        declarationAccepted: data.declarationAccepted,
        communicationsOptIn: data.communicationsOptIn,
      },
      select: { applicationId: true, status: true, createdAt: true },
    })

    return NextResponse.json({ ok: true, application: applicant }, { status: 201 })
  } catch (error) {
    console.error('Fellowship application submission failed:', error)
    return NextResponse.json({ ok: false, error: 'We could not submit your application. Please try again.' }, { status: 500 })
  }
}

const statusQuery = z.object({ applicationId: z.string().regex(/^SCCF-\d{4}-\d{5}$/i), email: z.string().email().optional() })

export async function GET(request: NextRequest) {
  const query = statusQuery.safeParse({
    applicationId: request.nextUrl.searchParams.get('applicationId') || '',
    email: request.nextUrl.searchParams.get('email') || undefined,
  })
  if (!query.success) return NextResponse.json({ ok: false, error: 'Enter a valid application ID.' }, { status: 400 })

  const applicant = await prisma.fellowshipApplicant.findUnique({
    where: { applicationId: query.data.applicationId.toUpperCase() },
    select: { applicationId: true, status: true, fullName: true, email: true, createdAt: true },
  })
  if (!applicant || (query.data.email && applicant.email !== query.data.email.toLowerCase())) {
    return NextResponse.json({ ok: false, error: 'We could not find an application matching those details.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, application: { applicationId: applicant.applicationId, status: applicant.status, applicantName: applicant.fullName, submittedAt: applicant.createdAt } })
}