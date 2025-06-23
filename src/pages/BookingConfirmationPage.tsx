import type React from 'react';
import { useState, useEffect } from 'react';
import { trackCTAClick } from '../utils/analytics';

interface CompletedBookingData {
  service: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
  } | null;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
    specialInstructions: string;
  };
  prefilledData?: {
    selectedService?: { service: string; description: string; features: string[] };
    selectedItems?: Record<string, number>;
    calculatedPrice?: number;
    pricingType?: string;
  } | null;
  completedAt: string;
}

const BookingConfirmationPage: React.FC = () => {
  const [bookingData, setBookingData] = useState<CompletedBookingData | null>(null);

  useEffect(() => {
    // Load completed booking data
    const storedData = localStorage.getItem('completedBooking');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setBookingData(parsed);

      // Track the conversion
      trackCTAClick('booking_completed', 'booking_confirmation_viewed', '/booking-confirmation');

      // Clean up the stored data after a delay (optional)
      setTimeout(() => {
        localStorage.removeItem('completedBooking');
      }, 60000); // Remove after 1 minute
    } else {
      // If no booking data, redirect to home
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, []);

  const handleNewBooking = () => {
    // Clear any remaining data
    localStorage.removeItem('bookingData');
    localStorage.removeItem('completedBooking');
    trackCTAClick('new_booking_started', 'confirmation_page', '/pricing');
    window.location.href = '/pricing';
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your booking confirmation...</p>
          <p className="text-sm text-gray-500 mt-2">If this takes too long, you'll be redirected to our home page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-brand-dark">Booking Confirmed</h1>
            <p className="text-gray-600 mt-2">Thank you for choosing 1clickclearance</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl text-green-500 mb-6">✓</div>
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Booking Confirmed!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for choosing 1clickclearance. Your booking has been confirmed and payment processed.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-bold text-brand-dark mb-4">Booking Details:</h3>

              {/* Show detailed items for calculator bookings */}
              {bookingData.prefilledData?.pricingType === 'items' && bookingData.prefilledData?.selectedItems ? (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Items to be collected:</p>
                  <div className="ml-4 space-y-1">
                    {Object.keys(bookingData.prefilledData.selectedItems).map(key => {
                      const [itemName, priceStr] = key.split('_');
                      const quantity = bookingData.prefilledData?.selectedItems?.[key];
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
              <p><strong>Postcode:</strong> {bookingData.customerDetails.postcode}</p>
              <p><strong>Booking Date:</strong> {new Date(bookingData.completedAt).toLocaleDateString()}</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to {bookingData.customerDetails.email}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">📧 What happens next:</p>
                <ul className="text-left space-y-1">
                  <li>• Confirmation email sent to your inbox</li>
                  <li>• Calendar invite for your selected time</li>
                  <li>• Call 30 minutes before arrival</li>
                  <li>• Professional, insured team arrives</li>
                  <li>• All items cleared responsibly</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="font-semibold mb-2">💚 Environmental Impact:</p>
                <p>Your items will be sorted for recycling, donation, or responsible disposal with our 95% recycling rate.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a href="/" className="btn-primary">
                  Return to Home
                </a>
                <button onClick={handleNewBooking} className="btn-secondary">
                  Book Another Service
                </button>
                <a href="/contact" className="btn-secondary">
                  Contact Us
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Need help or have questions?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:07775605848" className="text-brand-green hover:text-brand-dark font-semibold">
                    📞 Call 07775 605848
                  </a>
                  <a href="mailto:hello@1clickclearance.co.uk" className="text-brand-green hover:text-brand-dark font-semibold">
                    ✉️ Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof / Reviews CTA */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-brand-dark mb-3">Love Our Service?</h3>
            <p className="text-gray-600 mb-4">Help others discover 1clickclearance by leaving a review</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
                onClick={() => trackCTAClick('google_review_click', 'confirmation_page', 'https://www.google.com/maps')}
              >
                ⭐ Leave Google Review
              </a>
              <a
                href="https://www.trustpilot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
                onClick={() => trackCTAClick('trustpilot_review_click', 'confirmation_page', 'https://www.trustpilot.com')}
              >
                💙 Review on Trustpilot
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
