import type React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { trackCTAClick, trackFormStart, trackFormSubmit } from '../utils/analytics';

// Initialize Stripe with environment variable
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface BookingData {
  service: ServiceOption | null;
  date: Date | null;
  timeSlot: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
    specialInstructions: string;
  };
}

interface PaymentFormProps {
  bookingData: BookingData;
  prefilledData: {
    selectedService?: { service: string; description: string; features: string[] };
    selectedItems?: Record<string, number>;
    calculatedPrice?: number;
    pricingType?: string;
  } | null;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const services: ServiceOption[] = [
  {
    id: 'single-item',
    name: 'Single Item',
    price: 65,
    description: 'Perfect for individual items like mattress or washing machine',
    features: ['Individual item collection', 'Same day available', 'DBS checked staff', 'Fully insured']
  },
  {
    id: '1-yard',
    name: '1-Yard',
    price: 99,
    description: 'Similar to 5 bin bags, washing machine, or wheelie bin',
    features: ['Max Volume: 1 yd', 'Max Weight: 50kg', 'Max Labour: 10 minutes', 'Fast collection']
  },
  {
    id: '2-yard',
    name: '2-Yard',
    price: 139,
    description: 'Similar to 10 bin bags, 2-seater sofa, or 2 wheelie bins',
    features: ['Max Volume: 2 yd', 'Max Weight: 70kg', 'Max Labour: 10 minutes', 'Labour included']
  },
  {
    id: '4-yard',
    name: '4-Yard',
    price: 199,
    description: 'Similar to 20 bin bags, 3-seater sofa + chair, or 4 wheelie bins',
    features: ['Max Volume: 4 yd', 'Max Weight: 300kg', 'Max Labour: 30 minutes', 'Professional team']
  },
  {
    id: '7-yard',
    name: '7-Yard',
    price: 269,
    description: 'Similar to 35 bin bags, 7 wheelie bins, or 2 x 3-seater sofas + chair',
    features: ['Max Volume: 7 yd', 'Max Weight: 575kg', 'Max Labour: 50 minutes', 'DBS checked staff']
  }
];

const timeSlots = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00'
];

const PaymentForm: React.FC<PaymentFormProps> = ({ bookingData, prefilledData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !bookingData.service) {
      return;
    }

    setProcessing(true);
    trackFormSubmit('payment_form', bookingData as unknown as Record<string, unknown>);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Card information is required');
      setProcessing(false);
      return;
    }

    try {
      // Create payment intent using Netlify function
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingData.service.price * 100, // Convert to pence
          booking: bookingData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment processing failed');
      }

      const { client_secret } = await response.json();

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: bookingData.customerDetails.name,
            email: bookingData.customerDetails.email,
            phone: bookingData.customerDetails.phone,
            address: {
              line1: bookingData.customerDetails.address,
              postal_code: bookingData.customerDetails.postcode,
              country: 'GB', // UK country code for proper postcode validation
            },
          },
        },
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-brand-dark mb-2">Payment Summary</h4>

        {/* Show detailed items breakdown for calculator selections */}
        {prefilledData?.pricingType === 'items' && prefilledData?.selectedItems ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-brand-dark mb-2">Selected Items:</div>
            {Object.keys(prefilledData.selectedItems).map(key => {
              const [itemName, priceStr] = key.split('_');
              const price = Number.parseInt(priceStr);
              const quantity = prefilledData.selectedItems![key];
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span>{quantity}x {itemName}</span>
                  <span>£{price * quantity}</span>
                </div>
              );
            })}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total (Min. £65 charge)</span>
                <span className="font-bold text-brand-green">£{bookingData.service?.price}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Show standard service summary for volume-based bookings */
          <div className="flex justify-between items-center">
            <span>{bookingData.service?.name} Service</span>
            <span className="font-bold text-brand-green">£{bookingData.service?.price}</span>
          </div>
        )}

        <div className="text-sm text-gray-600 mt-2">
          Collection Time: To be scheduled via our AI-optimized booking system
        </div>
      </div>

      <div className="p-4 border border-gray-300 rounded-md">
        <CardElement
          options={{
            hidePostalCode: true, // Disable Stripe's ZIP code field for UK postcodes
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 rounded-md font-semibold ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-brand-green hover:bg-green-600 text-white'
        }`}
      >
        {processing ? 'Processing...' : `Pay £${bookingData.service?.price} & Confirm Booking`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
};

const BookingPage: React.FC = () => {
  const [step, setStep] = useState(2); // Skip service selection, start with customer details
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: null,
    timeSlot: '',
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      address: '',
      postcode: '',
      specialInstructions: ''
    }
  });

  const [prefilledData, setPrefilledData] = useState<{
    selectedService?: { service: string; description: string; features: string[] };
    selectedItems?: Record<string, number>;
    calculatedPrice?: number;
    pricingType?: string;
  } | null>(null);

  useEffect(() => {
    // Load pre-filled booking data from localStorage
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setPrefilledData(parsed);

      // Convert to service format for booking
      if (parsed.pricingType === 'volume' && parsed.selectedService) {
        setBookingData(prev => ({
          ...prev,
          service: {
            id: parsed.selectedService.service.toLowerCase().replace(' ', '-'),
            name: parsed.selectedService.service,
            price: parsed.calculatedPrice,
            description: parsed.selectedService.description,
            features: parsed.selectedService.features
          }
        }));
      } else if (parsed.pricingType === 'items' && parsed.selectedItems) {
        setBookingData(prev => ({
          ...prev,
          service: {
            id: 'custom-items',
            name: 'Custom Item Selection',
            price: parsed.calculatedPrice,
            description: `${Object.values(parsed.selectedItems).reduce((a: number, b: unknown) => a + (b as number), 0)} items selected`,
            features: ['Individual item pricing', 'Custom selection', 'Transparent pricing']
          }
        }));
      }
    }

    trackFormStart('booking_flow');
  }, []);

  const handleServiceSelect = (service: ServiceOption) => {
    setBookingData(prev => ({ ...prev, service }));
    setStep(2);
  };

  const handleCustomerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Go to payment after customer details
  };

  const handlePaymentSuccess = () => {
    setStep(4); // Go to calendar scheduling after payment
    trackCTAClick('payment_completed', 'payment_success', '/booking-scheduling');
  };

  const handleSchedulingComplete = () => {
    setStep(5); // Go to confirmation after scheduling
    trackCTAClick('booking_completed', 'scheduling_success', '/booking-confirmation');
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  const resetBooking = () => {
    setBookingData({
      service: null,
      date: null,
      timeSlot: '',
      customerDetails: {
        name: '',
        email: '',
        phone: '',
        address: '',
        postcode: '',
        specialInstructions: ''
      }
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-brand-dark">Book Your Clearance</h1>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= num ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Choose Your Service</h2>
              <p className="text-gray-600">Select the clearance service that best fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-brand-dark mb-2">{service.name}</h3>
                  <div className="text-3xl font-bold text-brand-green mb-4">£{service.price}</div>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleServiceSelect(service)}
                    className="w-full btn-primary"
                  >
                    Select This Service
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Customer Details */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Your Details</h2>
              <p className="text-gray-600">Please provide your contact and collection details</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleCustomerDetailsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerDetails.name}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        customerDetails: { ...prev.customerDetails, name: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingData.customerDetails.email}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        customerDetails: { ...prev.customerDetails, email: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingData.customerDetails.phone}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, phone: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    placeholder="e.g. 07775 605848"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Collection Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={bookingData.customerDetails.address}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, address: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    placeholder="Enter full collection address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.customerDetails.postcode}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, postcode: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    placeholder="CB1 2AB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingData.customerDetails.specialInstructions}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      customerDetails: { ...prev.customerDetails, specialInstructions: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    placeholder="Any access issues, specific items, or additional information..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-3"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Secure Payment</h2>
              <p className="text-gray-600">Complete your booking with secure card payment</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              {!stripePublishableKey ? (
                <div className="text-center p-8">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">Payment System Not Configured</h3>
                  <p className="text-gray-600 mb-6">
                    Stripe payment keys are not configured. Please contact our team to complete your booking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="tel:07775605848"
                      className="btn-primary"
                    >
                      Call 07775 605848
                    </a>
                    <a
                      href="/contact"
                      className="btn-secondary"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              ) : (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    bookingData={bookingData}
                    prefilledData={prefilledData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Motion Calendar Scheduling */}
        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Schedule Your Collection</h2>
              <p className="text-gray-600 mb-4">
                Our AI-powered scheduling system will find the optimal time for your collection
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">Smart Scheduling Features:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>30-minute collection slots with route optimization</li>
                  <li>Automatic 30-minute buffer between jobs</li>
                  <li>Maximum 6 bookings per day for quality service</li>
                  <li>Real-time availability based on location and team capacity</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Motion Calendar Embed */}
              <div className="relative w-full" style={{ height: '600px' }}>
                <iframe
                  src="https://calendar.motion.com/meet/1clickclearance/book"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Schedule your collection time"
                  className="w-full h-full"
                />
              </div>

              {/* Instructions below calendar */}
              <div className="p-6 bg-gray-50 border-t">
                <h4 className="font-semibold text-brand-dark mb-3">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Select your preferred date and time from the calendar above</li>
                  <li>You'll receive a confirmation email with collection details</li>
                  <li>Our team will contact you 30 minutes before arrival</li>
                  <li>Payment has been processed - no additional charges on collection day</li>
                </ol>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSchedulingComplete}
                    className="btn-primary flex-1"
                  >
                    Scheduling Complete - View Summary
                  </button>
                  <a
                    href="/contact"
                    className="btn-secondary flex-1 text-center"
                  >
                    Need Help? Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-6xl text-green-500 mb-6">✓</div>
              <h2 className="text-3xl font-bold text-brand-dark mb-4">Booking Confirmed!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for choosing 1clickclearance. Your booking has been confirmed and payment processed.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="font-bold text-brand-dark mb-4">Booking Details:</h3>

                {/* Show detailed items for calculator bookings */}
                {prefilledData?.pricingType === 'items' && prefilledData?.selectedItems ? (
                  <div className="mb-4">
                    <p className="font-semibold mb-2">Items to be collected:</p>
                    <div className="ml-4 space-y-1">
                      {Object.keys(prefilledData.selectedItems).map(key => {
                        const [itemName, priceStr] = key.split('_');
                        const quantity = prefilledData.selectedItems![key];
                        return (
                          <p key={key} className="text-sm">• {quantity}x {itemName}</p>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p><strong>Service:</strong> {bookingData.service?.name}</p>
                )}

                <p><strong>Scheduling:</strong> AI-optimized via Motion calendar</p>
                <p><strong>Collection Time:</strong> As scheduled in the calendar system</p>
                <p><strong>Amount Paid:</strong> £{bookingData.service?.price}</p>
                <p><strong>Collection Address:</strong> {bookingData.customerDetails.address}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  A confirmation email has been sent to {bookingData.customerDetails.email}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/" className="btn-primary">
                    Return to Home
                  </a>
                  <button onClick={resetBooking} className="btn-secondary">
                    Book Another Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
