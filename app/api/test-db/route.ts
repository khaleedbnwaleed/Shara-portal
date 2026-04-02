import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    console.log('DATABASE_URL set:', !!process.env.DATABASE_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    
    // Test basic connection with a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    
    console.log('✅ Database connection successful')
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: result,
      environmentVariables: {
        databaseUrlSet: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ Database connection failed:')
    console.error('Error:', errorMessage)
    console.error('Stack:', error instanceof Error ? error.stack : error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined,
      environmentVariables: {
        databaseUrlSet: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    }, { status: 500 })
  }
}
