import type React from 'react';
import { useState } from 'react';
import { validatePostcode, type PostcodeValidationResult } from '../utils/postcodeValidation';

const ServiceAreasPage: React.FC = () => {
  const [postcodeInput, setPostcodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<PostcodeValidationResult | null>(null);

  const handlePostcodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePostcode(postcodeInput);
    setValidationResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Service Areas & Coverage
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We provide professional clearance services within a 20-mile radius of our base in Shudy Camps, covering Cambridge, Essex, Suffolk, and parts of Hertfordshire.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Postcode Checker */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-brand-dark mb-4 text-center">
              Check Your Postcode
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Enter your postcode to see if we provide instant online bookings in your area
            </p>

            <form onSubmit={handlePostcodeCheck} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={postcodeInput}
                  onChange={(e) => setPostcodeInput(e.target.value)}
                  placeholder="Enter your postcode (e.g. CB1 2AB)"
                  className="w-full p-4 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  maxLength={8}
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-lg py-4"
              >
                Check Coverage
              </button>
            </form>

            {validationResult && (
              <div className={`mt-6 p-4 rounded-lg ${
                validationResult.type === 'success' ? 'bg-green-50 border border-green-200' :
                validationResult.type === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`text-sm ${
                  validationResult.type === 'success' ? 'text-green-800' :
                  validationResult.type === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {validationResult.message}
                </p>

                {validationResult.isValid ? (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a href="/pricing" className="btn-primary text-center">
                      View Pricing & Book Now
                    </a>
                    <a href="/contact" className="btn-secondary text-center">
                      Contact Us
                    </a>
                  </div>
                ) : validationResult.type === 'info' && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a href="/quote-selection" className="btn-primary text-center">
                      Request Quote
                    </a>
                    <a href="/contact" className="btn-secondary text-center">
                      Contact Us
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Coverage Map */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">
              Coverage Map
            </h2>

            {/* Map Container */}
            <div className="relative bg-gray-100 rounded-lg p-8 mb-8" style={{ minHeight: '500px' }}>
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold text-brand-dark mb-4">Service Coverage Areas</h3>

                {/* Coverage Areas Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <div className="bg-green-100 border border-green-300 rounded-lg p-6">
                    <h4 className="font-bold text-green-800 mb-3">Cambridge Areas</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Cambridge City (CB1-CB5)</li>
                      <li>• Ely & Newmarket (CB6-CB8)</li>
                      <li>• Haverhill (CB9)</li>
                      <li>• Saffron Walden (CB10-CB11)</li>
                      <li>• South Cambridgeshire (CB21-CB25)</li>
                    </ul>
                  </div>

                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-6">
                    <h4 className="font-bold text-blue-800 mb-3">Essex Areas</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Halstead (CO9)</li>
                      <li>• Sudbury (CO10)</li>
                      <li>• Dunmow (CM6)</li>
                      <li>• Witham (CM7)</li>
                      <li>• Stansted (CM22-CM23)</li>
                    </ul>
                  </div>

                  <div className="bg-orange-100 border border-orange-300 rounded-lg p-6">
                    <h4 className="font-bold text-orange-800 mb-3">Suffolk Areas</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Clare (IP28)</li>
                      <li>• Newmarket (IP29)</li>
                      <li>• Bury St Edmunds (IP32)</li>
                      <li>• Thurston (IP33)</li>
                    </ul>
                  </div>

                  <div className="bg-purple-100 border border-purple-300 rounded-lg p-6">
                    <h4 className="font-bold text-purple-800 mb-3">Hertfordshire</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Royston (SG8)</li>
                      <li>• Baldock (SG9)</li>
                      <li>• Quote available for other areas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Coverage Legend */}
              <div className="mt-8 flex justify-center">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h4 className="font-bold text-brand-dark mb-3 text-center">Service Levels</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                      <span className="text-sm">Instant Online Booking</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                      <span className="text-sm">Same Day Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded mr-2" />
                      <span className="text-sm">Quote Required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">
                Primary Service Areas
              </h3>
              <p className="text-gray-600 mb-4">
                We provide instant online booking and same-day service in our primary coverage areas.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cambridge & South Cambridgeshire
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Essex Towns (Sudbury, Halstead, Dunmow)
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Suffolk Areas (Newmarket, Bury St Edmunds)
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Parts of Hertfordshire (Royston, Baldock)
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">
                Extended Coverage
              </h3>
              <p className="text-gray-600 mb-4">
                We can often help with clearances outside our primary areas - just request a quote!
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom quotes available
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Larger jobs considered
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Competitive pricing
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fast response times
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-brand-green rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Book Your Clearance?</h3>
            <p className="text-lg mb-6">
              Check your postcode above or get started with instant online booking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/pricing" className="bg-white text-brand-green px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                View Pricing
              </a>
              <a href="/quote-selection" className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors">
                Request Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreasPage;
