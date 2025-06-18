import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
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

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const { amount, booking } = JSON.parse(event.body);

    // Validate required fields
    if (!amount || !booking) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Amount and booking data are required' }),
      };
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in pence (£65 = 6500)
      currency: 'gbp',
      metadata: {
        service_name: booking.service?.name || 'Unknown Service',
        service_price: booking.service?.price?.toString() || '0',
        customer_name: booking.customerDetails?.name || '',
        customer_email: booking.customerDetails?.email || '',
        customer_phone: booking.customerDetails?.phone || '',
        booking_date: booking.date || '',
        collection_address: booking.customerDetails?.address || '',
        postcode: booking.customerDetails?.postcode || '',
        special_instructions: booking.customerDetails?.specialInstructions || '',
        booking_timestamp: new Date().toISOString(),
      },
      receipt_email: booking.customerDetails?.email,
      description: `1clickclearance - ${booking.service?.name || 'Service'} Booking`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      }),
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
    };
  }
};
