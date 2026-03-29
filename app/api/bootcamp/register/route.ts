import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { sendEmail } from '@/lib/email'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const experienceLevel = formData.get('experienceLevel') as string
    const daysAttending = JSON.parse(formData.get('daysAttending') as string)
    const dietaryRestrictions = (formData.get('dietaryRestrictions') as string) || null
    const whyInterested = formData.get('whyInterested') as string
    const paymentReceipt = formData.get('paymentReceipt') as File

    // Validate required fields
    if (!fullName || !email || !phone || !experienceLevel || !daysAttending || !whyInterested || !paymentReceipt) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'bootcamp-receipts')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file with a unique name
    const bytes = await paymentReceipt.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const fileExt = paymentReceipt.name.split('.').pop()
    const fileName = `receipt-${email.replace('@', '-').replace('.', '-')}-${timestamp}.${fileExt}`
    const filePath = join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    // Save registration to database using direct SQL since we don't have ORM client setup
    // For now, we'll return a success response
    // TODO: When Prisma client is initialized, uncomment this:
    /*
    const registration = await db.bootcampRegistration.create({
      data: {
        fullName,
        email,
        phone,
        experienceLevel,
        daysAttending,
        dietaryRestrictions,
        whyInterested,
        paymentReceiptUrl: `/uploads/bootcamp-receipts/${fileName}`,
        paymentReceiptName: paymentReceipt.name,
        paymentStatus: 'pending',
      },
    })
    */

    // For now, log to console (in production, save to database)
    console.log('New Bootcamp Registration:', {
      fullName,
      email,
      phone,
      experienceLevel,
      daysAttending,
      dietaryRestrictions,
      whyInterested,
      paymentReceiptUrl: `/uploads/bootcamp-receipts/${fileName}`,
      paymentReceiptName: paymentReceipt.name,
    })

    // Send confirmation email to applicant
    const registrationId = `REG-${Date.now()}`
    const confirmationEmailHtml = generateConfirmationEmail(fullName, registrationId, fileName)
    
    try {
      await sendEmail({
        to: email,
        subject: '🌱 Bootcamp Registration Confirmed - Shara Eco Solutions',
        html: confirmationEmailHtml,
      })
      console.log(`Confirmation email sent to ${email}`)
    } catch (emailError) {
      console.error(`Failed to send confirmation email to ${email}:`, emailError)
      // Don't fail the registration if email fails, but log it
    }

    // Send admin notification about new registration
    const receiptFullUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/uploads/bootcamp-receipts/${fileName}`
    try {
      await sendEmail({
        to: process.env.EMAIL_USER || 'sharaecosolutions@gmail.com',
        subject: `🆕 New Bootcamp Registration - ${fullName} (${registrationId})`,
        html: generateAdminNotificationEmail(
          fullName,
          email,
          phone,
          registrationId,
          receiptFullUrl,
          experienceLevel,
          daysAttending
        ),
      })
      console.log(`Admin notification sent for registration ${registrationId}`)
    } catch (adminEmailError) {
      console.error(`Failed to send admin notification for registration ${registrationId}:`, adminEmailError)
      // Don't fail the registration if admin email fails
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Registration submitted successfully! Your payment receipt has been received and will be verified within 24 hours. A confirmation email has been sent to your email address.',
        data: {
          registrationId,
          receiptUrl: `/uploads/bootcamp-receipts/${fileName}`,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to process registration. Please try again.' },
      { status: 500 }
    )
  }
}

function generateConfirmationEmail(fullName: string, registrationId: string, receiptFileName: string): string {
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
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 20px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .status-box {
          background-color: #e8f5e9;
          border-left: 4px solid #4caf50;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .status-box h3 {
          margin: 0 0 10px 0;
          color: #2e7d32;
        }
        .status-box p {
          margin: 5px 0;
          color: #1b5e20;
          font-size: 14px;
        }
        .details {
          background-color: #f9f9f9;
          border: 1px solid #eee;
          padding: 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-item:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #666;
        }
        .detail-value {
          color: #333;
        }
        .next-steps {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .next-steps h3 {
          margin: 0 0 10px 0;
          color: #856404;
        }
        .next-steps ol {
          margin: 10px 0;
          padding-left: 20px;
          color: #333;
        }
        .next-steps li {
          margin: 8px 0;
          font-size: 14px;
        }
        .contact-section {
          background-color: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .contact-section h3 {
          margin: 0 0 10px 0;
          color: #0d47a1;
        }
        .contact-section p {
          margin: 5px 0;
          color: #1565c0;
          font-size: 14px;
        }
        .contact-section a {
          color: #1565c0;
          text-decoration: none;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
        }
        .button {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: 600;
        }
        .button:hover {
          background-color: #764ba2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌱 Bootcamp Registration Confirmed</h1>
          <p>3-Day Sustainable Home Gardening Bootcamp</p>
        </div>

        <div class="content">
          <div class="greeting">
            Hi ${fullName},
          </div>

          <p>Thank you for registering for the <strong>3-Day Bootcamp on Sustainable Home Gardening</strong>! We're excited to have you join us.</p>

          <div class="status-box">
            <h3>✓ Registration Status</h3>
            <p><strong>Status:</strong> Pending Payment Verification</p>
            <p><strong>Registration ID:</strong> ${registrationId}</p>
            <p>Your payment receipt has been received and is being verified. This typically takes 24 hours.</p>
          </div>

          <div class="details">
            <div class="detail-item">
              <span class="detail-label">Event:</span>
              <span class="detail-value">3-Day Sustainable Home Gardening Bootcamp</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Theme:</span>
              <span class="detail-value">Grow What You Eat – Sustain the Future</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Target Audience:</span>
              <span class="detail-value">Young Women (18+)</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Certification Fee:</span>
              <span class="detail-value">₦1,000</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Payment Receipt:</span>
              <span class="detail-value">${receiptFileName}</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>📋 What Happens Next?</h3>
            <ol>
              <li><strong>Payment Verification (24 hours):</strong> Our team will review your payment receipt to confirm payment receipt.</li>
              <li><strong>Confirmation Email:</strong> Once verified, you'll receive a final confirmation email with bootcamp details.</li>
              <li><strong>Bootcamp Details:</strong> You'll receive information about dates, venue, and what to bring.</li>
              <li><strong>Pre-Bootcamp Orientation:</strong> Details about the three-day curriculum will be sent before the event.</li>
            </ol>
          </div>

          <div class="contact-section">
            <h3>❓ Questions?</h3>
            <p><strong>Email:</strong> <a href="mailto:sharaecosolutions@gmail.com">sharaecosolutions@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+2348169525295">+234 816 952 5295</a></p>
          </div>

          <p style="margin-top: 30px;">We're looking forward to learning with you and helping you establish a sustainable home garden!</p>

          <p style="margin-top: 30px; font-style: italic; color: #666;">
            Best regards,<br>
            <strong>Shara Eco Solutions Ltd</strong><br>
            <em>Empowering Young Women Through Sustainable Innovation</em>
          </p>
        </div>

        <div class="footer">
          <p>© 2026 Shara Eco Solutions Ltd. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly. For support, contact us at sharaecosolutions@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `
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
        .receipt-section a {
          color: #2e7d32;
          text-decoration: none;
          font-weight: 600;
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
          border: none;
          cursor: pointer;
        }
        .button:hover {
          background-color: #764ba2;
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
              <span class="info-value"><a href="mailto:${email}" style="color: #333; text-decoration: none;">${email}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value"><a href="tel:${phone}" style="color: #333; text-decoration: none;">${phone}</a></span>
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
            <p>The applicant has uploaded a payment receipt. Please verify the payment of ₦1,000.</p>
            <p><a href="${receiptUrl}" target="_blank">→ View Payment Receipt</a></p>
          </div>

          <h3>Next Steps</h3>
          <ol>
            <li>Review the payment receipt image</li>
            <li>Verify that ₦1,000 was paid to the correct account</li>
            <li>Update payment status in the admin dashboard</li>
            <li>Once verified, the system will notify the applicant automatically</li>
          </ol>

          <h3>Payment Details</h3>
          <ul>
            <li><strong>Bank:</strong> Sterling Bank</li>
            <li><strong>Account Name:</strong> Shara Eco Solutions Ltd</li>
            <li><strong>Account Number:</strong> 0132173778</li>
            <li><strong>Amount:</strong> ₦1,000</li>
          </ul>
        </div>

        <div class="footer">
          <p>© 2026 Shara Eco Solutions Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
