import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_API_URL = 'https://api.paystack.co'

export async function POST(request: NextRequest) {
  try {
    const { email, amount, fullName, phone } = await request.json()

    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required' },
        { status: 400 }
      )
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      )
    }

    // Initialize transaction with Paystack
    const paystackRes = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata: {
          full_name: fullName,
          phone_number: phone,
          bootcamp_type: 'sustainable-home-gardening',
        },
      }),
    })

    const data = await paystackRes.json()

    if (!paystackRes.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize payment' },
        { status: paystackRes.status }
      )
    }

    return NextResponse.json({
      status: data.status,
      message: data.message,
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
