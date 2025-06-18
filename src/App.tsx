import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Page components
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import PricingPage from './pages/PricingPage';
import SizeGuidePage from './pages/SizeGuidePage';
import BookingPage from './pages/BookingPage';
import QuoteSelectionPage from './pages/QuoteSelectionPage';
import QuoteRequestPage from './pages/QuoteRequestPage';
import ServiceAreasPage from './pages/ServiceAreasPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Simple Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center">
                <img
                  src="https://ugc.same-assets.com/CoQo3Dc7usPgcAib46ch-9FchJ4MqfZi.png"
                  alt="1clickclearance Logo"
                  className="h-12 w-auto hover:opacity-90 transition-opacity duration-200"
                />
              </a>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-brand-dark hover:text-brand-green">Home</a>
                <a href="/pricing" className="text-brand-dark hover:text-brand-green">Pricing</a>
                <a href="/pricing" className="text-brand-dark hover:text-brand-green">Book Online</a>
                <a href="/size-guide" className="text-brand-dark hover:text-brand-green">Size Guide</a>
                <a href="/service-areas" className="text-brand-dark hover:text-brand-green">Service Areas</a>
                <a href="/contact" className="text-brand-dark hover:text-brand-green">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/quote-selection" element={<QuoteSelectionPage />} />
            <Route path="/quote/residential" element={<QuoteRequestPage />} />
            <Route path="/quote/garden" element={<QuoteRequestPage />} />
            <Route path="/quote/business" element={<QuoteRequestPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/service-areas" element={<ServiceAreasPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Comprehensive Home Page
const HomePage = () => {
  const services = [
    {
      title: "Residential Clearance",
      description: "Complete house clearances, single item removals, and garden waste collection.",
      icon: "🏠",
      features: ["Same day service", "Eco-friendly disposal", "Full insurance", "Fair pricing"]
    }
  ];

  const benefits = [
    { title: "Licensed & Insured", description: "Fully licensed waste carriers with £2M public liability insurance", icon: "🛡️" },
    { title: "Same Day Service", description: "Book online and get cleared today with our rapid response team", icon: "⚡" },
    { title: "Eco-Friendly", description: "95% recycling rate with environmental responsibility at our core", icon: "♻️" },
    { title: "Transparent Pricing", description: "No hidden fees - know exactly what you'll pay before we arrive", icon: "💰" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-green to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              1-Click Clearance Solutions
            </h1>
            <p className="text-xl lg:text-2xl mb-8">Fast, reliable, and eco-friendly waste clearance across East Anglia. Book online in just 1 CLICK!!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/pricing" className="bg-white text-brand-green font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Professional clearance solutions for your home</p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
            {services.map((service) => (
              <div key={service.title} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4 text-center">{service.icon}</div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4 text-center">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-center">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-700">
                      <span className="text-brand-green font-bold mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="/pricing" className="inline-block mt-6 text-brand-green font-semibold hover:text-brand-dark w-full text-center">
                  View Pricing →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">Professional Team You Can Trust</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our uniformed, DBS-checked team provides reliable clearance services with our fully branded vehicles across East Anglia.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-brand-green text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">Uniformed Professionals</h3>
                    <p className="text-gray-600 text-sm">DBS checked and fully trained</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-brand-green text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">Branded Vehicles</h3>
                    <p className="text-gray-600 text-sm">Professional fleet you can trust</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-brand-green text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">Fully Licensed</h3>
                    <p className="text-gray-600 text-sm">Licensed waste carriers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-brand-green text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark">Fully Insured</h3>
                    <p className="text-gray-600 text-sm">£2M public liability</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-last">
              <img
                src="https://ugc.same-assets.com/HdlN7ma-Ory_9KAxK4K7tVRixGGdT5BW.png"
                alt="1clickclearance professional team in uniforms loading appliances into branded van"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Why Choose 1clickclearance?</h2>
            <p className="text-xl text-gray-600">Trusted by customers across the Region</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">No hidden fees - know exactly what you'll pay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Small Load</h3>
              <div className="text-4xl font-bold text-brand-green mb-4">£99</div>
              <p className="text-gray-600 mb-6">Perfect for single items or small clearances</p>
              <a href="/pricing" className="btn-primary w-full">Book Now</a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center border-2 border-brand-green">
              <div className="bg-brand-green text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">Most Popular</div>
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Medium Load</h3>
              <div className="text-4xl font-bold text-brand-green mb-4">£139</div>
              <p className="text-gray-600 mb-6">Ideal for room clearances and medium jobs</p>
              <a href="/pricing" className="btn-primary w-full">Book Now</a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-2">Large Load</h3>
              <div className="text-4xl font-bold text-brand-green mb-4">£199</div>
              <p className="text-gray-600 mb-6">For house clearances and larger projects</p>
              <a href="/pricing" className="btn-primary w-full">Book Now</a>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/pricing" className="btn-secondary text-lg px-8 py-4">See All Pricing Options</a>
            <div className="mt-6">
              <a href="/size-guide" className="text-brand-green hover:text-brand-dark underline text-lg">
                Need help choosing the right size? View our Size Guide →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Clear Your Space?</h2>
          <p className="text-xl mb-8">Choose your pricing option and book your clearance in just one click</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="bg-white text-brand-green font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
              Book Now
            </a>
            <a href="/contact" className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-white hover:text-brand-green transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
