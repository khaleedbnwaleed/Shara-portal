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

    try {
      // Check for duplicate email + position
      const existingApp = await prisma.internshipApplication.findFirst({
        where: {
          email: data.email,
          position: data.position,
        },
      })

      if (existingApp) {
        return NextResponse.json(
          {
            ok: false,
            error: 'You have already submitted an application for this position',
          },
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
    } catch (dbError: any) {
      console.error('Database error:', dbError)

      // Provide specific error messages based on error type
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { ok: false, error: 'You have already submitted an application for this position' },
          { status: 409 }
        )
      }

      if (dbError.code === 'P1001' || dbError.code === 'P1002') {
        return NextResponse.json(
          {
            ok: false,
            error: 'Database connection error. Please try again later.',
          },
          { status: 503 }
        )
      }

      if (dbError.code === 'P2021') {
        return NextResponse.json(
          {
            ok: false,
            error: 'Application database table not found. Database may need to be migrated. Please contact support.',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        {
          ok: false,
          error: `Database error: ${dbError.message || 'Unknown error'}`,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      {
        ok: false,
        error:
          error.message || 'Failed to process application. Please try again later.',
      },
      { status: 500 }
    )
  }
}
