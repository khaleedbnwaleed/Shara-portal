# Bootcamp Registration with Manual Bank Payment

## Overview
The bootcamp registration system now uses manual bank payment with receipt upload. Applicants submit their payment receipts which are stored in the database and require admin verification.

## Architecture

### Database Schema (Prisma)
Located at `prisma/schema.prisma`

```prisma
model BootcampRegistration {
  id                   String   @id @default(cuid())
  fullName             String
  email                String
  phone                String
  experienceLevel      String
  daysAttending        String[]
  dietaryRestrictions  String?
  whyInterested        String
  paymentReceiptUrl    String   // URL of uploaded receipt
  paymentReceiptName   String   // Original filename
  paymentStatus        String   // 'pending', 'verified', 'rejected'
  paymentAmount        Int      // Amount in naira (1000)
  paymentVerifiedAt    DateTime?
  createdAt            DateTime
  updatedAt            DateTime
}
```

## Setup Instructions

### 1. Install Prisma (if not already installed)
```bash
npm install -D prisma @prisma/client
npm install @prisma/client
```

### 2. Initialize Prisma and Create Migration
```bash
# Generate Prisma client
npx prisma generate

# Create migration (this creates the database table)
npx prisma migrate dev --name add_bootcamp_registration

# Or push the schema to the database (for development)
npx prisma db push
```

### 3. Verify Database Connection
The project already has `DATABASE_URL` configured in `.env.local` pointing to Neon PostgreSQL.

## How It Works

### 1. Applicant Registration Flow
1. User fills out the bootcamp registration form
2. User makes a bank transfer of ₦1,000 to:
   - **Bank**: Access Bank
   - **Account**: Shara Eco Solutions Ltd
   - **Number**: 0759999999
3. User uploads payment receipt (JPEG, PNG, or PDF)
4. System saves registration and receipt to database
5. User sees confirmation page with payment verification status

### 2. API Endpoint: `/api/bootcamp/register` (POST)
- **Input**: FormData with:
  - fullName, email, phone
  - experienceLevel, daysAttending
  - dietaryRestrictions, whyInterested
  - paymentReceipt (file)
- **Output**: Registration ID and receipt URL
- **Storage**: 
  - Files: `public/uploads/bootcamp-receipts/`
  - Database: BootcampRegistration table

### 3. Payment Verification
Receipt files are stored with filenames like:
```
receipt-{email}-{timestamp}.{ext}
```

Admin dashboard can verify receipts by:
1. Viewing uploaded receipt images
2. Marking payment status as 'verified' or 'rejected'

## File Structure
```
app/
  api/
    bootcamp/
      register/
        route.ts          # Registration endpoint with file upload
  bootcamp/
    registration-success/
      page.tsx           # Success page after registration
components/
  bootcamp-form.tsx      # Registration form with receipt upload
prisma/
  schema.prisma          # Database schema
public/
  uploads/
    bootcamp-receipts/   # Storage for receipt files
```

## API Reference

### POST /api/bootcamp/register
Upload bootcamp registration with payment receipt

**Request** (FormData):
```
fullName: string
email: string
phone: string
experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced'
daysAttending: JSON string (array)
dietaryRestrictions: string (optional)
whyInterested: string
paymentReceipt: File (JPEG, PNG, PDF, max 5MB)
```

**Response** (Success - 201):
```json
{
  "status": "success",
  "message": "Registration submitted successfully!...",
  "data": {
    "registrationId": "REG-1234567890",
    "receiptUrl": "/uploads/bootcamp-receipts/receipt-email-1234567890.jpg"
  }
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Error description"
}
```

## Next Steps

### 1. Create Admin Dashboard
- View all registrations
- View uploaded receipts
- Verify/reject payments
- Send confirmation emails

### 2. Set Up Email Notifications
- Confirmation email to applicant after registration
- Verification email when payment is confirmed
- Rejection email if receipt is invalid

### 3. Complete Database Integration
The current registration endpoint logs to console. To fully enable database storage:
```typescript
// In /api/bootcamp/register/route.ts, uncomment and enable:
const registration = await prisma.bootcampRegistration.create({
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
```

### 4. Create Admin API for Payment Verification
```typescript
// PATCH /api/bootcamp/[id]/verify-payment
// To update paymentStatus and paymentVerifiedAt
```

## Bank Details to Display
Update these in the form component:
- **Bank**: Access Bank
- **Account Name**: Shara Eco Solutions Ltd
- **Account Number**: 0759999999
- **Amount**: ₦1,000

## Security Notes

1. File uploads are limited to 5MB and specific formats (JPEG, PNG, PDF)
2. Receipt files are stored in `public/uploads/` but should be secured
3. In production, consider storing files in cloud storage (S3, Cloudinary)
4. Validate file MIME types on both client and server
5. Sanitize filenames to prevent path traversal

## Troubleshooting

### Files not saving
- Ensure `public/uploads/bootcamp-receipts/` directory exists
- Check file permissions on the server
- Verify disk space available

### Database connection issues
- Check DATABASE_URL in `.env.local`
- Verify Neon PostgreSQL credentials
- Run `npx prisma db push` to sync schema

### Form submission errors
- Check browser console for error messages
- Verify FormData is being sent correctly
- Ensure file is selected before submission

## Database Commands

```bash
# View database schema
npx prisma studio

# Create backup
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```
