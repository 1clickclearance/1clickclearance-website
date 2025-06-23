# Live Stripe Payment Setup Guide

## 🚀 Quick Start - Connect Your Stripe Account

### Step 1: Get Your Stripe Keys

1. **Sign up/Login to Stripe**: Go to [https://stripe.com](https://stripe.com)
2. **Get API Keys**: Dashboard → Developers → API keys
3. **Copy these keys**:
   - **Publishable key**: `pk_test_...` or `pk_live_...`
   - **Secret key**: `sk_test_...` or `sk_live_...`
   - **Webhook secret**: `whsec_...` (we'll get this in step 3)

### Step 2: Configure Environment Variables

#### For Local Development:
Create `.env` file in project root:
```bash
# Copy from .env.example and update with your keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### For Netlify Production:
1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add these variables:
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your webhook secret (from step 3)

### Step 3: Set Up Stripe Webhook

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Add Endpoint**:
   - URL: `https://your-site-name.netlify.app/.netlify/functions/stripe-webhook`
   - Events: Select `payment_intent.succeeded` and `payment_intent.payment_failed`
3. **Copy Webhook Secret**: This is your `STRIPE_WEBHOOK_SECRET`

### Step 4: Deploy & Test

1. **Deploy to Netlify**: Push your changes or redeploy
2. **Test with Stripe Test Cards**:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - Requires 3D Secure: `4000 0025 0000 3155`

## 🧪 Testing Payment Flow End-to-End

### Test Checklist:

#### ✅ Frontend Tests:
- [ ] Stripe keys loaded correctly (no "Payment System Not Configured" error)
- [ ] Booking form validation works
- [ ] Date selection functions
- [ ] Customer details form submits
- [ ] Payment form displays Stripe elements

#### ✅ Payment Processing:
- [ ] Test card `4242 4242 4242 4242` processes successfully
- [ ] Declined card `4000 0000 0000 0002` shows error
- [ ] 3D Secure card prompts for authentication
- [ ] Booking confirmation displays after payment

#### ✅ Backend Integration:
- [ ] Payment intent creates successfully
- [ ] Webhook receives payment events
- [ ] Booking data saved in logs (check Netlify Functions logs)
- [ ] Customer receives Stripe receipt email

### Test Script:

```bash
# 1. Test the payment intent creation endpoint
curl -X POST https://your-site.netlify.app/.netlify/functions/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 6500,
    "booking": {
      "service": {"name": "Test Service", "price": 65},
      "customerDetails": {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "07775605848",
        "address": "123 Test St",
        "postcode": "CB1 2AB"
      },
      "date": "2024-01-15"
    }
  }'

# Expected response: {"client_secret": "pi_...", "payment_intent_id": "pi_..."}
```

## 🔄 Switching to Live Mode

### When Ready for Production:

1. **Get Live Keys**: Stripe Dashboard → switch to "Live" mode → API keys
2. **Update Environment Variables**:
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here
   STRIPE_SECRET_KEY=sk_live_your_live_key_here
   ```
3. **Update Webhook**: Point to live site URL
4. **Business Verification**: Complete Stripe account verification
5. **Test with Real Cards**: Use real payment methods for final testing

## 🔍 Monitoring & Debugging

### Check Stripe Dashboard:
- **Payments**: See all successful/failed payments
- **Customers**: View customer data
- **Webhooks**: Monitor webhook delivery status
- **Logs**: Debug any issues

### Check Netlify Functions Logs:
- Go to Netlify Dashboard → Functions → View logs
- Look for payment processing logs
- Check for any errors in webhook handling

### Common Issues & Solutions:

#### "Payment System Not Configured"
- ✅ Check `VITE_STRIPE_PUBLISHABLE_KEY` is set in Netlify environment
- ✅ Key starts with `pk_test_` or `pk_live_`
- ✅ Redeploy site after adding environment variables

#### "Payment Intent Creation Failed"
- ✅ Check `STRIPE_SECRET_KEY` is set correctly
- ✅ Key starts with `sk_test_` or `sk_live_`
- ✅ Check Netlify Functions logs for errors

#### "Webhook Signature Verification Failed"
- ✅ Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- ✅ Secret starts with `whsec_`
- ✅ Webhook URL points to correct function

## 📱 Test Flow Walkthrough

### Complete User Journey:
1. **Navigate** to website
2. **Select Service** on pricing page (or use calculator)
3. **Choose Date** on booking page
4. **Enter Details** (name, email, phone, address)
5. **Payment Page**:
   - Enter test card: `4242 4242 4242 4242`
   - Expiry: any future date (e.g., `12/25`)
   - CVC: any 3 digits (e.g., `123`)
   - Postal: any valid postcode
6. **Click "Pay & Confirm"**
7. **Success Page** should display
8. **Check Email** for Stripe receipt
9. **Check Stripe Dashboard** for payment record
10. **Check Netlify Logs** for booking processing

## 🎯 Next Steps

After successful payment integration:

1. **Database Integration**: Store bookings in a database (Supabase, Firebase, etc.)
2. **Email Notifications**: Send custom confirmation emails
3. **Calendar Integration**: Sync bookings with Google Calendar
4. **Admin Dashboard**: Build interface to manage bookings
5. **SMS Notifications**: Send SMS confirmations via Twilio

## 🆘 Support

If you encounter issues:
1. Check Stripe Dashboard for errors
2. Review Netlify Functions logs
3. Test with different cards
4. Verify all environment variables are set
5. Contact Stripe support for payment-specific issues

## 💰 Going Live Checklist

Before accepting real payments:
- [ ] Switch to live Stripe keys
- [ ] Complete Stripe account verification
- [ ] Test with real bank account
- [ ] Set up proper customer support
- [ ] Implement booking management system
- [ ] Add terms of service and privacy policy
- [ ] Set up proper error monitoring
