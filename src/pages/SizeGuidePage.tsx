import React from 'react';
import { trackCTAClick } from '../utils/analytics';

const SizeGuidePage = () => {
  const handleBookingClick = (source: string) => {
    trackCTAClick('booking', source, '/pricing');
    window.location.href = '/pricing';
  };

  const services = [
    {
      name: "Single Item",
      volume: "N/A",
      weight: "Varies",
      laborTime: "15 Minutes",
      price: "£65",
      description: "Perfect for individual items like mattress, washing machine, or armchair",
      examples: "Mattress, washing machine, armchair, bed frame, or similar single item",
      icon: "📦"
    },
    {
      name: "1-Yard",
      volume: "1 yd³",
      weight: "50kg",
      laborTime: "10 Minutes",
      price: "£99",
      description: "Equivalent to 5 bin bags or 1 wheelie bin",
      examples: "5 refuse sacks, single wheelie bin, small furniture items",
      icon: "🗑️"
    },
    {
      name: "2-Yard",
      volume: "2 yd³",
      weight: "70kg",
      laborTime: "10 Minutes",
      price: "£139",
      description: "Equivalent to 10 bin bags or 2 wheelie bins",
      examples: "10 refuse sacks, 2 wheelie bins, small sofa",
      icon: "📋"
    },
    {
      name: "4-Yard",
      volume: "4 yd³",
      weight: "300kg",
      laborTime: "30 Minutes",
      price: "£199",
      description: "Equivalent to 20 bin bags or small skip",
      examples: "20 refuse sacks, 3-seater sofa + chair, garden waste",
      icon: "🚛"
    },
    {
      name: "7-Yard",
      volume: "7 yd³",
      weight: "575kg",
      laborTime: "50 Minutes",
      price: "£269",
      description: "Equivalent to 35 bin bags or builders skip",
      examples: "35 refuse sacks, 2 x 3-seater sofas, room clearance",
      icon: "🏗️"
    }
  ];

  const itemPricing = [
    { category: 'Furniture & Beds', items: [
      { name: 'Armchair / Office Chair', price: 41 },
      { name: '2-Seater Sofa', price: 51 },
      { name: '3-Seater Sofa', price: 65 },
      { name: 'Corner Sofa', price: 115 },
      { name: 'Sofa Bed', price: 72 },
      { name: 'Single Bed Base/Frame', price: 35 },
      { name: 'Double/Kingsize Bed Base/Frame', price: 38 },
      { name: 'Single Mattress', price: 22 },
      { name: 'Double Mattress', price: 26 },
      { name: 'Kingsize Mattress', price: 30 }
    ]},
    { category: 'Appliances', items: [
      { name: 'Washing Machine / Dryer / Dishwasher', price: 27 },
      { name: 'Cooker', price: 27 },
      { name: 'Domestic Fridge/Freezer', price: 42 },
      { name: 'TV', price: 22 }
    ]},
    { category: 'General Items', items: [
      { name: 'Bag of Junk', price: 12 },
      { name: 'Extra Labour (10 mins)', price: 20 }
    ]}
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white logo-watermark-large">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Booking & Size Guide
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the perfect service size for your clearance needs. Our transparent pricing means no surprises.
            </p>
            <a
              href="/pricing"
              onClick={() => handleBookingClick('hero')}
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Book Online Now
            </a>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-brand-green text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Important Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📏 Volume Cap</h3>
                <p className="text-sm">Each booking has a maximum volume limit measured in cubic yards</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">⚖️ Weight Cap</h3>
                <p className="text-sm">Maximum weight limits ensure safe and efficient collection</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold mb-2">⏱️ Labour Time Cap</h3>
                <p className="text-sm">Included labour time for loading and carrying items</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/20 rounded-lg">
              <p className="text-sm">
                <strong>Please Note:</strong> Once any of the 3 caps (volume, weight, or labor time) are reached, your booking is fulfilled.
                If you're uncertain about the right size, please call our team for guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Size Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">Choose Your Service Size</h2>
          <p className="text-lg text-gray-600">Select the option that best matches your clearance needs</p>
        </div>

        <div className="space-y-8 mb-16">
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {services.slice(0, 3).map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col logo-watermark">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">{service.name}</h3>
                  <div className="text-3xl font-bold text-brand-green mb-2">{service.price}</div>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {/* Only show Max Volume for non-Single Item services */}
                  {service.name !== "Single Item" && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700">Max Volume:</span>
                      <span className="text-brand-green font-bold">{service.volume}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Max Weight:</span>
                    <span className="text-brand-green font-bold">{service.weight}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-700">Labour Time:</span>
                    <span className="text-brand-green font-bold">{service.laborTime}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Examples:</h4>
                  <p className="text-sm text-gray-600">{service.examples}</p>
                </div>

                <a
                  href="/pricing"
                  onClick={() => handleBookingClick('service_card')}
                  className="w-full btn-primary mt-auto text-center block"
                >
                  Book This Size
                </a>
              </div>
            ))}
          </div>

          {/* Second row - 2 cards centered */}
          {services.length > 3 && (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                {services.slice(3).map((service, index) => (
                  <div key={index + 3} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col logo-watermark">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">{service.icon}</div>
                      <h3 className="text-2xl font-bold text-brand-dark mb-2">{service.name}</h3>
                      <div className="text-3xl font-bold text-brand-green mb-2">{service.price}</div>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    </div>

                    <div className="space-y-3 mb-6 flex-grow">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Max Volume:</span>
                        <span className="text-brand-green font-bold">{service.volume}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Max Weight:</span>
                        <span className="text-brand-green font-bold">{service.weight}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700">Labour Time:</span>
                        <span className="text-brand-green font-bold">{service.laborTime}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 mb-2">Examples:</h4>
                      <p className="text-sm text-gray-600">{service.examples}</p>
                    </div>

                    <a
                      href="/pricing"
                      onClick={() => handleBookingClick('service_card')}
                      className="w-full btn-primary mt-auto text-center block"
                    >
                      Book This Size
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item-Based Pricing Guide */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Item-Based Pricing Guide</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Prefer exact pricing per item? Choose from our comprehensive item-based pricing with a minimum charge of £65.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {itemPricing.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-50 rounded-lg shadow-md p-6 logo-watermark">
                <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">{category.category}</h3>

                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-semibold text-brand-green">£{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-green-50 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
              <p className="text-gray-700">
                <strong>Minimum charge: £65</strong><br />
                All prices include collection, disposal & VAT
              </p>
            </div>
            <a
              href="/pricing"
              onClick={() => handleBookingClick('item_guide')}
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Use Item-Based Calculator
            </a>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">How Our Booking System Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="bg-brand-green text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Choose Your Size</h3>
              <p className="text-gray-600">Select the service size that matches your clearance needs based on volume, weight, or item count</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-green text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">Book Online</h3>
              <p className="text-gray-600">Complete your booking online with instant confirmation and transparent pricing</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-green text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">We Collect</h3>
              <p className="text-gray-600">Our professional team arrives on time and handles all the loading and disposal</p>
            </div>
          </div>

          {/* Professional Service in Action */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src="https://ugc.same-assets.com/Cr-U-dIE9hompA0za1OZKyKxJMPHv9En.png"
                  alt="1clickclearance professional team loading appliances into branded van"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 flex items-center">
                <div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-4">Professional Service in Action</h3>
                  <p className="text-gray-600 mb-6">
                    Our uniformed, DBS-checked team handles everything from loading to disposal.
                    You can trust our experienced professionals to take care of your clearance needs safely and efficiently.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-brand-green font-bold mr-3">✓</span>
                      <span className="text-gray-700">Professional uniformed team</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-brand-green font-bold mr-3">✓</span>
                      <span className="text-gray-700">Branded, insured vehicles</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-brand-green font-bold mr-3">✓</span>
                      <span className="text-gray-700">Safe handling of all items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What's Always Included */}
      <div className="bg-white py-16 logo-watermark-large">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-dark mb-4">What's Always Included</h2>
              <p className="text-lg text-gray-600">Every 1clickclearance service includes comprehensive coverage with no hidden extras</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Service Includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Professional, uniformed team</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>All loading and transportation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Environmentally responsible disposal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Waste transfer documentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Full public liability insurance</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Quality Guarantee:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Same day service available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>DBS checked staff</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>No hidden costs or surprises</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Exact price guarantee</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-bold mr-3">✓</span>
                    <span>Customer satisfaction guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Clearance?</h2>
          <p className="text-xl mb-8">Get started with transparent pricing and instant booking</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pricing"
              onClick={() => handleBookingClick('cta')}
              className="bg-white text-brand-green font-semibold py-4 px-8 rounded-md hover:bg-gray-100 transition-colors duration-200 text-center"
            >
              Book Online Now
            </a>
            <a
              href="tel:07775605848"
              onClick={() => trackCTAClick('phone_call', 'cta', 'tel:07775605848')}
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-md hover:bg-white hover:text-brand-green transition-all duration-200 text-center"
            >
              Call 07775 605848
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
