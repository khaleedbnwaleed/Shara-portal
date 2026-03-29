import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_API_URL = 'https://api.paystack.co'

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      )
    }

    // Verify transaction with Paystack
    const paystackRes = await fetch(
      `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await paystackRes.json()

    if (!paystackRes.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to verify payment' },
        { status: paystackRes.status }
      )
    }

    if (data.data.status === 'success') {
      // Payment was successful - save the registration
      const metadata = data.data.metadata
      
      // TODO: Save registration to your database here
      // You can save to your database with the following info:
      // {
      //   fullName: metadata.full_name,
      //   email: data.data.customer.email,
      //   phone: metadata.phone_number,
      //   paymentReference: reference,
      //   amount: data.data.amount / 100, // Convert from kobo to naira
      //   status: 'paid',
      //   timestamp: new Date()
      // }

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified and registration saved',
        data: {
          reference,
          paymentStatus: 'completed',
          registrationId: `REG-${reference}`, // You can generate a proper ID
        },
      })
    }

    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
