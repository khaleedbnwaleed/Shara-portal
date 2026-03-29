# Paystack Payment Gateway Setup Guide

## Overview
The bootcamp registration form now integrates Paystack for processing the ₦1,000 certification fee.

## Setup Steps

### 1. Create a Paystack Account
- Go to [paystack.com](https://paystack.com)
- Sign up and verify your account
- Complete your business verification

### 2. Get Your API Keys
- Log in to your Paystack Dashboard
- Go to **Settings** → **API Keys & Webhooks**
- Copy your **Secret Key** (you'll use this in your environment variables)
- Copy your **Public Key** (optional, for frontend use if needed)

### 3. Add Environment Variables
Create or update your `.env.local` file in the project root:

```bash
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
# OR for testing:
# PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

### 4. (Optional) Enable Webhooks in Paystack
For production, set up webhooks to verify payments:

1. In Paystack Dashboard → Settings → API Keys & Webhooks
2. Set your Webhook URL to: `https://yourdomain.com/api/bootcamp/payment-webhook`
3. You can create a webhook handler at `/app/api/bootcamp/payment-webhook/route.ts`

## How It Works

1. **Registration Form**: User fills bootcamp details and clicks "Register for Bootcamp & Pay"
2. **Payment Initialization** (`/api/bootcamp/payment-init`):
   - User data is sent to this endpoint
   - Endpoint initializes a Paystack transaction
   - User is redirected to Paystack payment page

3. **User Completes Payment**: User enters payment details on Paystack

4. **Verification** (`/api/bootcamp/payment-verify`):
   - After payment, call this endpoint with the payment reference
   - It verifies the transaction with Paystack
   - Registration is saved to your database

## Implementation Notes

### Current Implementation
- ✅ Payment initialization endpoint set up
- ✅ Payment verification endpoint created
- ✅ Form UI updated with certification fee display
- ✅ Button shows amount to be paid

### What Needs to Be Done
- [ ] Add `PAYSTACK_SECRET_KEY` to `.env.local`
- [ ] Create a database schema for bootcamp registrations
- [ ] Update `/api/bootcamp/payment-verify` to save registrations to DB
- [ ] Create a success page to show after payment (`/bootcamp/payment-success`)
- [ ] Create a callback page to handle payment verification and create email confirmation

## Database Schema (Example)

```typescript
// Save registration with payment info
interface BootcampRegistration {
  id: string
  fullName: string
  email: string
  phone: string
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  daysAttending: string[]
  dietaryRestrictions?: string
  whyInterested: string
  paymentReference: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  amount: number
  createdAt: Date
  updatedAt: Date
}
```

## Testing

### Test Paystack Credentials
- **Test Public Key**: `pk_test_...`
- **Test Secret Key**: `sk_test_...`

### Test Card Details
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- OTP: `123456`

## Security Notes

1. Never commit your secret key to version control
2. Always use environment variables for sensitive keys
3. Verify payment signatures on the backend
4. Use HTTPS in production
5. Store payment references for auditing

## Need Help?

- Paystack Documentation: https://paystack.com/docs/api/
- Paystack Dashboard: https://dashboard.paystack.com
