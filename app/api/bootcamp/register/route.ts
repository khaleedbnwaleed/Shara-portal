import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { sendEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export const maxDuration = 60 // Set timeout to 60 seconds for file upload

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Bootcamp registration request received')
    
    const formData = await request.formData()

    // Extract form fields
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const experienceLevel = formData.get('experienceLevel') as string
    const daysAttendingRaw = formData.get('daysAttending') as string
    const paymentReceipt = formData.get('paymentReceipt') as File

    // Parse daysAttending
    let daysAttending: string[] = []
    try {
      const parsed = JSON.parse(daysAttendingRaw || '[]')
      daysAttending = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Failed to parse daysAttending:', daysAttendingRaw)
      daysAttending = []
    }

    console.log('📋 Form data extracted:', { 
      fullName, 
      email, 
      phone, 
      experienceLevel, 
      daysAttending: daysAttending.length,
      paymentReceipt: paymentReceipt?.name 
    })

    // Validate required fields
    if (!fullName || !email || !phone || !experienceLevel || daysAttending.length === 0 || !paymentReceipt) {
      console.error('❌ Validation failed: Missing required fields', {
        fullName: !!fullName,
        email: !!email,
        phone: !!phone,
        experienceLevel: !!experienceLevel,
        daysAttending: daysAttending.length > 0,
        paymentReceipt: !!paymentReceipt,
      })
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'bootcamp-receipts')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
      console.log('📁 Created uploads directory')
    }

    // Save file with a unique name
    const bytes = await paymentReceipt.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const fileExt = paymentReceipt.name.split('.').pop()
    const fileName = `receipt-${email.replace('@', '-').replace('.', '-')}-${timestamp}.${fileExt}`
    const filePath = join(uploadsDir, fileName)

    await writeFile(filePath, buffer)
    console.log(`📄 Payment receipt uploaded: ${fileName} (${buffer.length} bytes)`)

    const registrationId = `BOOTCAMP-${timestamp}`
    const receiptUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/uploads/bootcamp-receipts/${fileName}`
    
    // Save registration to Neon database
    let dbRecord = null
    try {
      dbRecord = await prisma.bootcampRegistration.create({
        data: {
          id: `bootcamp-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
          fullName,
          email,
          phone,
          experienceLevel,
          daysAttending,
          whyInterested: 'Submitted via bootcamp form',
          paymentReceiptUrl: receiptUrl,
          paymentReceiptName: fileName,
          paymentStatus: 'pending',
          paymentAmount: 1000,
        },
      })
      console.log(`📊 Registration saved to database with ID: ${dbRecord.id}`)
    } catch (dbError) {
      console.error('⚠️ Failed to save registration to database:', dbError)
      // Continue processing even if database save fails - we have the file and can send emails
    }

    const dayLabels: { [key: string]: string } = {
      'day1': 'Day 1 - Soil Health & Fundamentals',
      'day2': 'Day 2 - Planting & Composting',
      'day3': 'Day 3 - Garden Planning & Harvest',
    }

    const selectedDays = daysAttending.map((day: string) => dayLabels[day] || day).join(', ')

    // Send confirmation email to applicant
    try {
      await sendEmail({
        to: email,
        subject: '✅ Bootcamp Application Received - Shara Eco Solutions',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                .content { border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 8px 8px; }
                .details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { margin: 8px 0; }
                .detail-label { font-weight: bold; color: #6b7280; }
                .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
                .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🌱 Bootcamp Application Received</h1>
                  <p>Payment Evidence Received</p>
                </div>
                
                <div class="content">
                  <p>Hi ${fullName},</p>
                  
                  <p>We've received your application and payment receipt for the Sustainable Home Gardening Bootcamp!</p>
                  
                  <h2>Your Application Details:</h2>
                  <div class="details">
                    <div class="detail-row">
                      <span class="detail-label">Name:</span> ${fullName}
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Email:</span> ${email}
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Phone:</span> ${phone}
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Experience Level:</span> ${experienceLevel}
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Days Selected:</span> ${selectedDays}
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Certification Fee:</span> ₦1,000
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Receipt File:</span> ${paymentReceipt.name}
                    </div>
                  </div>
                  
                  <h3>What Happens Next?</h3>
                  <p>Our team will review your payment receipt and contact you within 24 hours to:</p>
                  <ul>
                    <li>Verify your payment</li>
                    <li>Confirm your spot in the bootcamp</li>
                    <li>Send detailed bootcamp schedule and location</li>
                    <li>Answer any questions you may have</li>
                  </ul>
                  
                  <p style="margin-top: 30px;">We're excited to help you start your sustainable gardening journey!</p>
                  
                  <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                    <strong>Contact Us:</strong> sharaecosolutions@gmail.com | +234 816 952 5295
                  </p>
                </div>
                
                <div class="footer">
                  <p>© 2026 Shara Eco Solutions. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
      console.log(`Confirmation email sent to ${email}`)
    } catch (emailError) {
      console.error(`Failed to send confirmation email to ${email}:`, emailError)
    }

    // Send notification email to admin
    try {
      await sendEmail({
        to: process.env.EMAIL_USER || 'sharaecosolutions@gmail.com',
        subject: `📋 New Bootcamp Application - ${fullName} (${registrationId})`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; }
                .details { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 14px; }
                .detail-row { margin: 6px 0; }
                .button { display: inline-block; background: #059669; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🆕 New Bootcamp Application with Payment</h2>
                </div>
                
                <div class="content">
                  <p><strong>New applicant with payment receipt received:</strong></p>
                  
                  <div class="details">
                    <div class="detail-row"><strong>Name:</strong> ${fullName}</div>
                    <div class="detail-row"><strong>Email:</strong> ${email}</div>
                    <div class="detail-row"><strong>Phone:</strong> ${phone}</div>
                    <div class="detail-row"><strong>Experience:</strong> ${experienceLevel}</div>
                    <div class="detail-row"><strong>Days:</strong> ${selectedDays}</div>
                    <div class="detail-row"><strong>Registration ID:</strong> ${registrationId}</div>
                    <div class="detail-row"><strong>Receipt File:</strong> ${fileName}</div>
                  </div>
                  
                  <p><strong>Action Required:</strong> Verify the payment receipt below within 24 hours.</p>
                  
                  <a href="${receiptUrl}" class="button">View Payment Receipt</a>
                  
                  <p style="margin-top: 20px; font-size: 13px; color: #6b7280;">
                    <strong>Expected Amount:</strong> ₦1,000<br>
                    <strong>Account:</strong> Shara Eco Solutions Ltd, Sterling Bank (0132173778)
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
      console.log(`Admin notification sent for registration ${registrationId}`)
    } catch (adminEmailError) {
      console.error(`Failed to send admin notification:`, adminEmailError)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully. Your payment receipt has been received and will be verified within 24 hours.',
        registrationId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Bootcamp registration error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: errorMessage || 'Failed to submit application' },
      { status: 500 }
    )
  }
}
