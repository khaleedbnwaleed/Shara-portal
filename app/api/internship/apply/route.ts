import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApplicationRef } from '@/lib/internship'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.fullName || !data.email || !data.position) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check for duplicate email + position
    const existingApp = await prisma.internshipApplication.findFirst({
      where: {
        email: data.email,
        position: data.position,
      },
    })

    if (existingApp) {
      return NextResponse.json(
        { ok: false, error: 'You have already submitted an application for this position' },
        { status: 409 }
      )
    }

    // Generate unique reference
    let applicationRef = generateApplicationRef()
    let refExists = true
    
    while (refExists) {
      const existing = await prisma.internshipApplication.findUnique({
        where: { applicationRef },
      })
      if (!existing) {
        refExists = false
      } else {
        applicationRef = generateApplicationRef()
      }
    }

    // Create application
    const application = await prisma.internshipApplication.create({
      data: {
        ...data,
        applicationRef,
        status: 'pending',
      },
    })

    return NextResponse.json({
      ok: true,
      applicationRef: application.applicationRef,
      applicationId: application.id,
    })
  } catch (error) {
    console.error('Internship application error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
