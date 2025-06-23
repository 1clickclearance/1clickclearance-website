import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent: Stripe.Event;

  try {
    if (!event.body || !sig) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing body or signature' }),
      };
    }

    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;

        // Log successful payment
        console.log('Payment succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          customer_email: paymentIntent.receipt_email,
          metadata: paymentIntent.metadata,
        });

        // Here you would typically:
        // 1. Create booking record in your database
        // 2. Send confirmation email to customer
        // 3. Send notification to your team
        // 4. Update calendar availability

        // For now, we'll log the booking details
        await processSuccessfulBooking(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', {
          id: failedPayment.id,
          last_payment_error: failedPayment.last_payment_error,
          metadata: failedPayment.metadata,
        });
        break;

      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook handler error:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook handler failed' }),
    };
  }
};

async function processSuccessfulBooking(paymentIntent: Stripe.PaymentIntent) {
  const bookingData = {
    payment_intent_id: paymentIntent.id,
    amount_paid: paymentIntent.amount / 100, // Convert from pence to pounds
    currency: paymentIntent.currency,
    customer_email: paymentIntent.receipt_email,
    service_name: paymentIntent.metadata.service_name,
    service_price: paymentIntent.metadata.service_price,
    customer_name: paymentIntent.metadata.customer_name,
    customer_phone: paymentIntent.metadata.customer_phone,
    booking_date: paymentIntent.metadata.booking_date,
    collection_address: paymentIntent.metadata.collection_address,
    postcode: paymentIntent.metadata.postcode,
    special_instructions: paymentIntent.metadata.special_instructions,
    booking_timestamp: paymentIntent.metadata.booking_timestamp,
    payment_status: 'completed',
    created_at: new Date().toISOString(),
  };

  // Log the booking (in a real app, save to database)
  console.log('New booking created:', bookingData);

  // TODO: Implement the following:
  // 1. Save booking to database
  // 2. Send confirmation email to customer
  // 3. Send notification to your team
  // 4. Add to calendar system
  // 5. Send SMS confirmation (optional)

  try {
    // Example: Send confirmation email (you'd implement this with your email service)
    // await sendBookingConfirmationEmail(bookingData);

    // Example: Add to calendar (you'd implement this with your calendar API)
    // await addToCalendar(bookingData);

    console.log('Booking processed successfully');
  } catch (error) {
    console.error('Error processing booking:', error);
    // You might want to retry or alert your team
  }
}
