import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApplicationRef } from '@/lib/internship'

// Retry helper function for transient database errors
async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Retry on connection errors, but not on logical errors
      if (
        error.code === 'P1001' || // Database connection error
        error.code === 'P1002' || // Timeout error
        error.message?.includes('Connection terminated')
      ) {
        if (attempt < maxRetries) {
          // Exponential backoff: 100ms, 200ms, 400ms
          await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)))
          continue
        }
      } else {
        // Don't retry on non-connection errors
        throw error
      }
    }
  }

  throw lastError || new Error('Failed after retries')
}

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
      // Check for duplicate email + position with retry
      const existingApp = await executeWithRetry(() =>
        prisma.internshipApplication.findFirst({
          where: {
            email: data.email,
            position: data.position,
          },
        })
      )

      if (existingApp) {
        return NextResponse.json(
          {
            ok: false,
            error: 'You have already submitted an application for this position',
          },
          { status: 409 }
        )
      }

      // Generate unique reference with retry
      let applicationRef = generateApplicationRef()
      let refExists = true
      let attemptCount = 0

      while (refExists && attemptCount < 10) {
        const existing = await executeWithRetry(() =>
          prisma.internshipApplication.findUnique({
            where: { applicationRef },
          })
        )

        if (!existing) {
          refExists = false
        } else {
          applicationRef = generateApplicationRef()
          attemptCount++
        }
      }

      if (refExists) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Failed to generate unique application reference. Please try again.',
          },
          { status: 500 }
        )
      }

      // Create application with retry
      const application = await executeWithRetry(() =>
        prisma.internshipApplication.create({
          data: {
            ...data,
            applicationRef,
            status: 'pending',
          },
        })
      )

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
            error:
              'Database connection error. Please check your connection and try again in a moment.',
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

      if (dbError.message?.includes('Connection terminated')) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'Database connection was interrupted. Please try submitting your application again.',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        {
          ok: false,
          error: `Error: ${dbError.message || 'Failed to process application'}`,
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
