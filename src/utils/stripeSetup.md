# Stripe Payment Integration Setup

## Required Stripe Setup

### 1. Create Stripe Account
- Sign up at https://stripe.com
- Get your API keys from Dashboard → Developers → API keys
- Use test keys for development: `pk_test_...` and `sk_test_...`

### 2. Update BookingPage.tsx
Replace the test key in `BookingPage.tsx`:
```typescript
// Replace this line:
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

// With your actual publishable key:
const stripePromise = loadStripe('pk_test_51ABC123...');
```

### 3. Backend Implementation Required

You need to create a backend endpoint at `/api/create-payment-intent` that:

1. Receives the booking data and amount
2. Creates a Stripe Payment Intent
3. Returns the client_secret

#### Example Backend (Node.js/Express):
```javascript
const stripe = require('stripe')('sk_test_your_secret_key_here');

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, booking } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in pence (£65 = 6500)
      currency: 'gbp',
      metadata: {
        service: booking.service.name,
        customer_email: booking.customerDetails.email,
        booking_date: booking.date,
        // Add other booking details as needed
      },
    });

    res.send({
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
```

### 4. Webhook for Booking Confirmation

Set up a webhook to handle successful payments and create bookings:

```javascript
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Create booking in your database
    // Send confirmation email
    // Update calendar availability
  }

  res.json({received: true});
});
```

### 5. Environment Variables
```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 6. Testing
Use Stripe test card numbers:
- Success: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
- Requires 3D Secure: 4000 0025 0000 3155

## Production Deployment

1. Replace test keys with live keys
2. Set up proper backend hosting (Vercel, Netlify Functions, etc.)
3. Configure webhook endpoints
4. Set up proper database for booking storage
5. Implement email confirmation system

## Alternative: Use Stripe Payment Links

For a simpler setup without backend code, you can use Stripe Payment Links:
1. Create payment links in Stripe Dashboard
2. Replace the payment form with direct links to Stripe checkout
3. Set up redirect URLs for success/cancel
