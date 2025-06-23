import React from 'react';
import { trackCTAClick } from '../utils/analytics';

const QuoteSelectionPage = () => {
  const handleSelectionClick = (clearanceType: string) => {
    trackCTAClick('quote_selection', clearanceType, '/quote');

    if (clearanceType === 'residential') {
      window.location.href = '/quote/residential';
    } else if (clearanceType === 'garden') {
      window.location.href = '/quote/garden';
    } else if (clearanceType === 'business') {
      window.location.href = '/quote/business';
    }
  };

  const clearanceTypes = [
    {
      id: 'residential',
      title: 'Residential Clearance',
      description: 'Full house clearances, room clearances, and large residential projects',
      icon: '🏠',
      features: [
        'Full house clearances',
        'Room by room clearance',
        'Furniture and appliance removal',
        'Estate clearances',
        'Custom quotes available'
      ]
    },
    {
      id: 'garden',
      title: 'Garden Clearance',
      description: 'Large garden clearances, landscaping waste, and outdoor projects',
      icon: '🌿',
      features: [
        'Garden waste removal',
        'Tree and hedge cutting waste',
        'Soil and rubble clearance',
        'Shed dismantling',
        'Landscaping project cleanup'
      ]
    },
    {
      id: 'business',
      title: 'Business / Office Clearance',
      description: 'Commercial clearances, office moves, and business waste removal',
      icon: '🏢',
      features: [
        'Office clearances',
        'Commercial premises',
        'Retail unit clearance',
        'Warehouse clearance',
        'Confidential waste disposal'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Get Quote for Large Jobs
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the type of clearance service you need. We provide custom quotes for large-scale projects
              that require site evaluation and specialized handling.
            </p>
          </div>
        </div>
      </div>

      {/* Service Selection Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {clearanceTypes.map((clearanceType) => (
            <div key={clearanceType.id} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{clearanceType.icon}</div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{clearanceType.title}</h3>
                <p className="text-gray-600 mb-6">{clearanceType.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {clearanceType.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectionClick(clearanceType.id)}
                className="w-full btn-primary text-center"
              >
                Get Quote for {clearanceType.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Why Choose Our Large Job Service?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Custom Site Evaluation</h3>
                <p className="text-gray-600">
                  For large projects, we visit your site to provide an accurate assessment and detailed quote.
                  This ensures fair pricing and proper planning for complex clearances.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Specialized Equipment</h3>
                <p className="text-gray-600">
                  Large clearances often require specialized equipment and additional team members.
                  We have the resources to handle projects of any size efficiently and safely.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  We understand that large projects need flexible timing. We work around your schedule
                  and can arrange multi-day clearances when necessary.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-brand-dark mb-4">Full Documentation</h3>
                <p className="text-gray-600">
                  All large jobs include comprehensive documentation, waste transfer notes,
                  and certificates for responsible disposal and recycling.
                </p>
              </div>
            </div>

            <div className="bg-brand-green text-white rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Need Standard Clearance Services?</h3>
              <p className="text-lg mb-6">
                For smaller jobs, use our instant booking system with transparent pricing by volume or individual items.
              </p>
              <a
                href="/pricing"
                className="bg-white text-brand-green font-semibold py-3 px-6 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                View Standard Pricing & Book Online
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSelectionPage;
