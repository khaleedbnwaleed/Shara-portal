import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { fullName, serviceType, industryType } = await request.json();

    // Configure your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to Shara
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sharaecosolutions@gmail.com',
      subject: 'New Service Booking Request',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Industry Type:</strong> ${industryType}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Booking sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send booking' },
      { status: 500 }
    );
  }
}
