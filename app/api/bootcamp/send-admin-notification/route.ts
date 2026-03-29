import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, registrationId, receiptUrl, experienceLevel, daysAttending } = await request.json()

    if (!fullName || !email || !registrationId || !receiptUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send admin notification email
    const adminEmail = process.env.EMAIL_USER || 'sharaecosolutions@gmail.com'
    const adminEmailHtml = generateAdminNotificationEmail(
      fullName,
      email,
      phone,
      registrationId,
      receiptUrl,
      experienceLevel,
      daysAttending
    )

    await sendEmail({
      to: adminEmail,
      subject: `🆕 New Bootcamp Registration - ${fullName} (${registrationId})`,
      html: adminEmailHtml,
    })

    return NextResponse.json(
      {
        status: 'success',
        message: 'Admin notification sent',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return NextResponse.json(
      { error: 'Failed to send admin notification' },
      { status: 500 }
    )
  }
}

function generateAdminNotificationEmail(
  fullName: string,
  email: string,
  phone: string,
  registrationId: string,
  receiptUrl: string,
  experienceLevel: string,
  daysAttending: string[]
): string {
  const dayLabels: { [key: string]: string } = {
    'day1': 'Day 1 - Foundations of Sustainable Gardening',
    'day2': 'Day 2 - Planting Techniques and Garden Setup',
    'day3': 'Day 3 - Garden Maintenance, Harvest, and Sustainability',
  }

  const daysText = daysAttending.map((day: string) => dayLabels[day] || day).join(', ')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
          padding: 20px;
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px 20px;
        }
        .alert {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .alert h3 {
          margin: 0 0 10px 0;
          color: #856404;
        }
        .applicant-info {
          background-color: #f9f9f9;
          border: 1px solid #eee;
          padding: 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #666;
        }
        .info-value {
          color: #333;
        }
        .receipt-section {
          background-color: #e8f5e9;
          border-left: 4px solid #4caf50;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .receipt-section h3 {
          margin: 0 0 10px 0;
          color: #2e7d32;
        }
        .button {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 5px 10px 0;
          font-weight: 600;
        }
        .button:hover {
          background-color: #764ba2;
        }
        .button-secondary {
          display: inline-block;
          background-color: #f44336;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px 5px 10px 0;
          font-weight: 600;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 New Bootcamp Registration</h1>
        </div>

        <div class="content">
          <div class="alert">
            <h3>⚠️ Action Required: Payment Verification</h3>
            <p>A new applicant has registered for the bootcamp. Please verify their payment receipt within 24 hours.</p>
          </div>

          <h2>Applicant Information</h2>
          <div class="applicant-info">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${fullName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Experience Level:</span>
              <span class="info-value">${experienceLevel}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Days Attending:</span>
              <span class="info-value">${daysText}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Registration ID:</span>
              <span class="info-value"><strong>${registrationId}</strong></span>
            </div>
          </div>

          <div class="receipt-section">
            <h3>💳 Payment Receipt</h3>
            <p>The applicant has uploaded a payment receipt. Please verify the payment.</p>
            <p>Receipt URL: <a href="${receiptUrl}" target="_blank" style="color: #2e7d32; text-decoration: underline;">${receiptUrl}</a></p>
          </div>

          <h3>Next Steps</h3>
          <ol>
            <li>Review the payment receipt</li>
            <li>Verify that ₦1,000 was received</li>
            <li>Update the payment status (Verified/Rejected) in the admin dashboard</li>
            <li>If verified, the applicant will receive confirmation with event details</li>
          </ol>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://shara-portal.vercel.app/admin/bootcamp-registrations" class="button">View Admin Dashboard</a>
          </div>
        </div>

        <div class="footer">
          <p>© 2026 Shara Eco Solutions Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
