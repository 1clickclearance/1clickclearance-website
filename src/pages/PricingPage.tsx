import React, { useState, useEffect } from 'react';
import { trackCalculatorInteraction, trackCalculatorConversion, trackCTAClick } from '../utils/analytics';

const PricingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('residential');
  const [pricingType, setPricingType] = useState('volume'); // 'volume' or 'items'
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});
  const [showCalculator, setShowCalculator] = useState(false);

  // Item-based pricing data - exact prices from original site
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
    ]},
    { category: 'Service Charges', items: [
      { name: 'Single Item Call Out Charge', price: 65 }
    ]}
  ];

  const residentialServices = [
    {
      service: "Single Item",
      description: "Perfect for individual items like mattress or washing machine",
      price: "£65",
      features: ["Individual item collection", "Same day available", "DBS checked staff", "Fully insured"]
    },
    {
      service: "1-Yard",
      description: "Similar to 5 bin bags, washing machine, or wheelie bin",
      price: "£99",
      features: ["Max Volume: 1 yd", "Max Weight: 50kg", "Max Labour: 10 minutes", "Fast collection"]
    },
    {
      service: "2-Yard",
      description: "Similar to 10 bin bags, 2-seater sofa, or 2 wheelie bins",
      price: "£139",
      features: ["Max Volume: 2 yd", "Max Weight: 70kg", "Max Labour: 10 minutes", "Labour included"]
    },
    {
      service: "4-Yard",
      description: "Similar to 20 bin bags, 3-seater sofa + chair, or 4 wheelie bins",
      price: "£199",
      features: ["Max Volume: 4 yd", "Max Weight: 300kg", "Max Labour: 30 minutes", "Professional team"]
    },
    {
      service: "7-Yard",
      description: "Similar to 35 bin bags, 7 wheelie bins, or 2 x 3-seater sofas + chair",
      price: "£269",
      features: ["Max Volume: 7 yd", "Max Weight: 575kg", "Max Labour: 50 minutes", "DBS checked staff"]
    }
    // {
    //   service: "10-Yard",
    //   description: "Similar to 50 bin bags, 10 wheelie bins, or just under half of a Luton van",
    //   price: "£369",
    //   features: ["Max Volume: 10 yd", "Max Weight: 850kg", "Max Labour: 70 minutes", "Fully insured"]
    // },
    // {
    //   service: "14-Yard",
    //   description: "Similar to 70 bin bags or just over half of a Luton van",
    //   price: "£429",
    //   features: ["Max Volume: 14 yd", "Max Weight: 950kg", "Max Labour: 80 minutes", "Professional service"]
    // }
  ];

  // Business services removed to focus on residential clearances only
  const businessServices: typeof residentialServices = [];

  const currentServices = selectedCategory === 'residential' ? residentialServices : businessServices;

  // Calculator functions with analytics
  const updateItemQuantity = (itemName: string, price: number, quantity: number) => {
    const key = `${itemName}_${price}`;
    const oldQuantity = selectedItems[key] || 0;

    setSelectedItems(prev => {
      if (quantity === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: quantity };
    });

    // Track calculator interaction
    trackCalculatorInteraction(quantity > oldQuantity ? 'item_added' : 'item_removed', {
      item_name: itemName,
      item_price: price,
      new_quantity: quantity,
      old_quantity: oldQuantity
    });
  };

  const calculateTotal = () => {
    let total = 0;
    for (const key of Object.keys(selectedItems)) {
      const [itemName, priceStr] = key.split('_');
      const price = Number.parseInt(priceStr);
      const quantity = selectedItems[key];
      total += price * quantity;
    }
    return Math.max(total, 65); // Minimum charge £65
  };

  const getSelectedItemsCount = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const clearCalculator = () => {
    const itemCount = getSelectedItemsCount();
    const totalPrice = calculateTotal();

    trackCalculatorInteraction('calculator_cleared', {
      items_cleared: itemCount,
      total_value_cleared: totalPrice
    });

    setSelectedItems({});
  };

  const handleCalculatorToggle = () => {
    const newShowState = !showCalculator;
    setShowCalculator(newShowState);

    trackCalculatorInteraction(newShowState ? 'calculator_opened' : 'calculator_closed', {
      pricing_type: pricingType
    });
  };

  const handleBookingClick = (source: string, price?: number) => {
    if (source === 'calculator' && getSelectedItemsCount() > 0) {
      trackCalculatorConversion(selectedItems, calculateTotal());
      // Store calculation data for booking
      const bookingData = {
        selectedItems,
        calculatedPrice: calculateTotal(),
        pricingType: 'items'
      };
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      window.location.href = '/book';
      return;
    }

    trackCTAClick('booking', source, '/pricing');
  };

  const handlePricingTypeChange = (newType: string) => {
    trackCalculatorInteraction('pricing_type_changed', {
      from_type: pricingType,
      to_type: newType
    });
    setPricingType(newType);
  };

  // Track page view on mount
  useEffect(() => {
    // This would typically be done in a layout component or router
    // trackPageView('pricing', { pricing_type: pricingType });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Transparent Pricing for Every Need
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              No hidden fees, no surprises. Get instant quotes and book your clearance service in just one click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handlePricingTypeChange('items')}
                className="btn-primary text-lg px-8 py-4"
              >
                Book Online Now
              </button>
              <a
                href="/quote-selection"
                className="btn-secondary text-lg px-8 py-4 inline-block"
              >
                Get Quote for Large Jobs
              </a>
            </div>
            <div className="mt-6">
              <a href="/size-guide" className="text-brand-green hover:text-brand-dark underline">
                Need help choosing the right size? View our Size Guide →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Type Toggle */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-sm border">
            <button
              onClick={() => handlePricingTypeChange('volume')}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-200 ${
                pricingType === 'volume'
                  ? 'bg-brand-green text-white'
                  : 'text-gray-600 hover:text-brand-dark'
              }`}
            >Price by Volume
            </button>
            <button
              onClick={() => handlePricingTypeChange('items')}
              className={`px-8 py-3 rounded-md font-semibold transition-all duration-200 ${
                pricingType === 'items'
                  ? 'bg-brand-green text-white'
                  : 'text-gray-600 hover:text-brand-dark'
              }`}
            >
              Price by Item
            </button>
          </div>
        </div>

        {/* Focus on residential services only */}
        {pricingType === 'volume' && (
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-brand-dark">Residential Clearance Services</h2>
            <p className="text-gray-600 mt-2">Professional home clearance solutions for every need</p>
            <div className="mt-4">
              <a href="/size-guide" className="text-brand-green hover:text-brand-dark underline text-lg">
                📏 View detailed size guide with examples →
              </a>
            </div>
          </div>
        )}

        {/* Volume-based Pricing Cards */}
        {pricingType === 'volume' && (
          <div className="space-y-8 mb-16">
            {/* First row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {currentServices.slice(0, 3).map((service, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-brand-dark mb-2">{service.service}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-brand-green">{service.price}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (service.service === 'Single Item') {
                        // For Single Item, switch to item calculator
                        handlePricingTypeChange('items');
                        setShowCalculator(true);
                        trackCTAClick('calculator_opened', 'single_item_service', '/pricing');
                      } else {
                        // For other services, proceed to booking
                        const bookingData = {
                          selectedService: service,
                          calculatedPrice: Number.parseInt(service.price.replace('£', '')),
                          pricingType: 'volume'
                        };
                        localStorage.setItem('bookingData', JSON.stringify(bookingData));
                        trackCTAClick('booking', 'service_card', '/book');
                        window.location.href = '/book';
                      }
                    }}
                    className="w-full btn-primary block text-center"
                  >
                    Book This Service
                  </button>
                </div>
              ))}
            </div>

            {/* Second row - 2 cards centered */}
            {currentServices.length > 3 && (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                  {currentServices.slice(3).map((service, index) => (
                    <div key={index + 3} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-brand-dark mb-2">{service.service}</h3>
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                        <div className="text-3xl font-bold text-brand-green">{service.price}</div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (service.service === 'Single Item') {
                            // For Single Item, switch to item calculator
                            handlePricingTypeChange('items');
                            setShowCalculator(true);
                            trackCTAClick('calculator_opened', 'single_item_service', '/pricing');
                          } else {
                            // For other services, proceed to booking
                            const bookingData = {
                              selectedService: service,
                              calculatedPrice: Number.parseInt(service.price.replace('£', '')),
                              pricingType: 'volume'
                            };
                            localStorage.setItem('bookingData', JSON.stringify(bookingData));
                            trackCTAClick('booking', 'service_card', '/book');
                            window.location.href = '/book';
                          }
                        }}
                        className="w-full btn-primary block text-center"
                      >
                        Book This Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Item-based Pricing Tables */}
        {pricingType === 'items' && (
          <div className="space-y-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-brand-dark mb-4">Transparent Item-Based Pricing</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
                Know exactly what you'll pay with our clear, upfront pricing. Simply select the items you need cleared and get an instant quote.
              </p>
              <button
                onClick={handleCalculatorToggle}
                className="btn-primary text-lg px-8 py-3"
              >
                {showCalculator ? 'Hide Calculator' : 'Use Interactive Calculator'}
              </button>
            </div>

            {/* Interactive Calculator */}
            {showCalculator && (
              <div className="mb-8 bg-gradient-to-r from-brand-green to-green-600 text-white rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Your Quote Calculator</h3>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Items selected: {getSelectedItemsCount()}</div>
                    <div className="text-3xl font-bold">£{calculateTotal()}</div>
                    <div className="text-sm opacity-90">
                      {calculateTotal() === 65 && getSelectedItemsCount() > 0 ? 'Minimum charge applied' : 'Total price'}
                    </div>
                  </div>
                </div>

                {getSelectedItemsCount() > 0 && (
                  <div className="bg-white/20 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">Selected Items:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.keys(selectedItems).map(key => {
                        const [itemName, priceStr] = key.split('_');
                        const price = Number.parseInt(priceStr);
                        const quantity = selectedItems[key];
                        return (
                          <div key={key} className="flex justify-between">
                            <span>{quantity}x {itemName}</span>
                            <span>£{price * quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={clearCalculator}
                    className="px-6 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                    disabled={getSelectedItemsCount() === 0}
                  >
                    Clear All
                  </button>
                  <a
                    href="/book"
                    onClick={() => handleBookingClick('calculator', calculateTotal())}
                    className={`flex-1 px-6 py-2 bg-white text-brand-green font-semibold rounded-md hover:bg-gray-100 transition-colors text-center ${getSelectedItemsCount() === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    Book This Quote - £{calculateTotal()}
                  </a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {itemPricing.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <h3 className="text-2xl font-bold text-brand-dark mb-6 text-center">{category.category}</h3>

                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => {
                      const itemKey = `${item.name}_${item.price}`;
                      const currentQuantity = selectedItems[itemKey] || 0;

                      return (
                        <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <span className="text-gray-700">{item.name}</span>
                          </div>

                          {showCalculator ? (
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold text-brand-green">£{item.price}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateItemQuantity(item.name, item.price, Math.max(0, currentQuantity - 1))}
                                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-semibold"
                                  disabled={currentQuantity === 0}
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-semibold">{currentQuantity}</span>
                                <button
                                  onClick={() => updateItemQuantity(item.name, item.price, currentQuantity + 1)}
                                  className="w-8 h-8 rounded-full bg-brand-green hover:bg-green-600 text-white flex items-center justify-center text-sm font-semibold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="font-semibold text-brand-green">£{item.price}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>Minimum charge: £65</strong><br />
                      All prices include collection, disposal & VAT
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-green text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">How Item Pricing Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-3xl font-bold mb-2">1</div>
                  <h4 className="font-semibold mb-2">Select Your Items</h4>
                  <p className="text-sm opacity-90">Choose exactly what you need cleared from our comprehensive price list</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">2</div>
                  <h4 className="font-semibold mb-2">Get Instant Quote</h4>
                  <p className="text-sm opacity-90">See your total price immediately with no hidden costs or surprises</p>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">3</div>
                  <h4 className="font-semibold mb-2">Book & Pay</h4>
                  <p className="text-sm opacity-90">Schedule your collection and pay the exact price quoted</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-6">
                {pricingType === 'volume' ? 'How Our Volume Pricing Works' : 'Why Choose Item-Based Pricing?'}
              </h2>
              <div className="space-y-4 text-gray-700">
                {pricingType === 'volume' ? (
                  <>
                    <p>Our transparent pricing is based on the volume of waste and the complexity of the job. No hidden fees, no surprises.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>Volume-based pricing for fair and accurate quotes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>All disposal and recycling costs included</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>No additional charges for stairs or difficult access</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>Flexible payment options available</span>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p>Get complete transparency with our item-based pricing. Know exactly what you'll pay before we arrive.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>Precise pricing per individual item</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>No guesswork or volume estimation needed</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>Perfect for single items or mixed clearances</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-brand-green font-semibold mr-2">•</span>
                        <span>Minimum £65 charge applies</span>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-brand-dark mb-6">What's Always Included</h2>
              <div className="space-y-4 text-gray-700">
                <p>Every 1clickclearance service includes comprehensive coverage with no hidden extras.</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-brand-green font-semibold mr-2">✓</span>
                    <span>Professional, uniformed team</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-semibold mr-2">✓</span>
                    <span>All loading and transportation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-semibold mr-2">✓</span>
                    <span>Environmentally responsible disposal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-semibold mr-2">✓</span>
                    <span>Waste transfer documentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green font-semibold mr-2">✓</span>
                    <span>Full public liability insurance</span>
                  </li>
                  {pricingType === 'items' && (
                    <li className="flex items-start">
                      <span className="text-brand-green font-semibold mr-2">✓</span>
                      <span>Exact price guarantee - pay only what's quoted</span>
                    </li>
                  )}
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
          <p className="text-xl mb-8">Get an instant quote and book your service in under 2 minutes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                handlePricingTypeChange('items');
                setShowCalculator(true);
              }}
              className="bg-white text-brand-green font-semibold py-4 px-8 rounded-md hover:bg-gray-100 transition-colors duration-200 text-center"
            >
              Start Calculator
            </button>
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

export default PricingPage;
