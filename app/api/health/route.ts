import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'DATABASE_URL environment variable is not set',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    // Try to import and use Prisma
    try {
      const { prisma } = await import('@/lib/prisma')

      // Try a simple query to check database connection
      const result = await prisma.$queryRaw`SELECT 1`

      return NextResponse.json(
        {
          status: 'healthy',
          database: 'connected',
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      )
    } catch (dbError: any) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          details: dbError.message,
          code: dbError.code,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
