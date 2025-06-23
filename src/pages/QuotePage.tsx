import React, { useState, useEffect } from 'react';
import { QUOTE_FORM_RULES, useFormValidation, getNestedValue } from '../utils/validation';
import { trackQuoteStart, trackQuoteCalculation, trackQuoteConversion, trackFormStart, trackFormSubmit, trackFormSuccess, trackFormError, analytics } from '../utils/analytics';

const QuotePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Initialize form validation
  const {
    data: formData,
    errors,
    touched,
    updateField,
    touchField,
    validateAll,
    reset,
    isValid
  } = useFormValidation({
    serviceType: '',
    wasteType: '',
    volumeEstimate: '',
    location: '',
    accessibility: '',
    urgency: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  }, QUOTE_FORM_RULES);

  const serviceTypes = [
    { id: 'residential', name: 'Residential Clearance', basePrice: 89 },
    { id: 'business', name: 'Business/Office Clearance', basePrice: 199 },
    // { id: 'construction', name: 'Construction Waste', basePrice: 149 },
    { id: 'garden', name: 'Garden Waste', basePrice: 79 },
    { id: 'appliance', name: 'Appliance Removal', basePrice: 69 },
    { id: 'furniture', name: 'Furniture Removal', basePrice: 99 }
  ];

  const wasteTypes = [
    'General Household Items', 'Furniture & Mattresses', 'Electrical Equipment',
    'Garden Waste', /* 'Construction Materials', */ 'Office Equipment', 'Mixed Waste'
  ];

  const volumeOptions = [
    { value: 'small', label: 'Small (up to 1.5m³)', multiplier: 1 },
    { value: 'medium', label: 'Medium (1.5-3m³)', multiplier: 1.8 },
    { value: 'large', label: 'Large (3-4.5m³)', multiplier: 2.5 },
    { value: 'xlarge', label: 'Extra Large (4.5m³+)', multiplier: 3.5 }
  ];

  const accessibilityOptions = [
    { value: 'easy', label: 'Easy access (ground floor, parking nearby)', multiplier: 1 },
    { value: 'moderate', label: 'Moderate access (stairs, limited parking)', multiplier: 1.2 },
    { value: 'difficult', label: 'Difficult access (multiple flights, no parking)', multiplier: 1.4 }
  ];

  const urgencyOptions = [
    { value: 'flexible', label: 'Flexible (within 7 days)', multiplier: 1 },
    { value: 'urgent', label: 'Urgent (within 2 days)', multiplier: 1.3 },
    { value: 'same_day', label: 'Same day service', multiplier: 1.6 }
  ];

  // Track quote start when component mounts
  useEffect(() => {
    trackQuoteStart({ page: 'quote_calculator' });
    trackFormStart('quote_form');
  }, []);

  // Calculate price when relevant fields change
  useEffect(() => {
    if (formData.serviceType && formData.volumeEstimate && formData.accessibility && formData.urgency) {
      calculatePrice();
    }
  }, [formData.serviceType, formData.volumeEstimate, formData.accessibility, formData.urgency]);

  const calculatePrice = () => {
    const service = serviceTypes.find(s => s.id === formData.serviceType);
    const volume = volumeOptions.find(v => v.value === formData.volumeEstimate);
    const access = accessibilityOptions.find(a => a.value === formData.accessibility);
    const urgency = urgencyOptions.find(u => u.value === formData.urgency);

    if (service && volume && access && urgency) {
      const price = service.basePrice * volume.multiplier * access.multiplier * urgency.multiplier;
      const finalPrice = Math.round(price);
      setEstimatedPrice(finalPrice);

      // Track quote calculation
      trackQuoteCalculation({
        service_type: formData.serviceType,
        waste_type: formData.wasteType,
        volume: formData.volumeEstimate,
        accessibility: formData.accessibility,
        urgency: formData.urgency,
        location: formData.location
      }, finalPrice);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleFieldBlur = (field: string) => {
    touchField(field);
  };

  const getFieldError = (field: string): string | undefined => {
    return touched[field] && errors[field] ? errors[field][0] : undefined;
  };

  const isFieldInvalid = (field: string): boolean => {
    return touched[field] && errors[field] && errors[field].length > 0;
  };

  const validateCurrentStep = (): boolean => {
    const stepFields = getStepFields(currentStep);
    let isStepValid = true;

    // Touch and validate fields for current step
    stepFields.forEach(field => {
      touchField(field);
      const value = field.includes('.') ? getNestedValue(formData, field) : (formData as any)[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        isStepValid = false;
      }
    });

    return isStepValid;
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1: return ['serviceType'];
      case 2: return ['wasteType', 'volumeEstimate', 'location'];
      case 3: return ['accessibility', 'urgency'];
      case 4: return ['contactInfo.name', 'contactInfo.email', 'contactInfo.phone', 'contactInfo.address'];
      default: return [];
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        const newStep = currentStep + 1;
        setCurrentStep(newStep);

        // Track step progress
        analytics.trackFormProgress('quote_form', newStep, 4);

        if (newStep === 4) {
          calculatePrice();
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validation = validateAll();

    if (!validation.isValid) {
      // Track validation errors
      Object.entries(validation.errors).forEach(([field, fieldErrors]) => {
        if (fieldErrors.length > 0) {
          analytics.trackFormValidationError('quote_form', field, fieldErrors[0]);
        }
      });

      // Show first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      const stepWithError = getStepForField(firstErrorField);
      if (stepWithError !== currentStep) {
        setCurrentStep(stepWithError);
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Track form submission
      trackFormSubmit('quote_form', formData);

      // Track quote conversion
      trackQuoteConversion({
        service_type: formData.serviceType,
        estimated_price: estimatedPrice,
        contact_provided: true
      }, estimatedPrice);

      // Simulate API call - replace with actual endpoint
      const response = await submitQuoteRequest({
        ...formData,
        estimatedPrice
      });

      if (response.success) {
        trackFormSuccess('quote_form', {
          quote_id: response.quoteId,
          estimated_price: estimatedPrice,
          response_time: Date.now()
        });

        setSubmitStatus('success');
        setSubmitMessage(`Thank you! Your quote request has been submitted. Quote ID: ${response.quoteId}. We'll contact you within 2 hours to confirm details and arrange your clearance.`);
      } else {
        throw new Error(response.error || 'Failed to submit quote');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quote';
      trackFormError('quote_form', errorMessage);
      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepForField = (field: string): number => {
    if (['serviceType'].includes(field)) return 1;
    if (['wasteType', 'volumeEstimate', 'location'].includes(field)) return 2;
    if (['accessibility', 'urgency'].includes(field)) return 3;
    if (field.startsWith('contactInfo.')) return 4;
    return 1;
  };

  // Real Netlify Forms submission
  const submitQuoteRequest = async (data: any): Promise<{success: boolean, quoteId?: string, error?: string}> => {
    try {
      const quoteId = `QUO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'quote-form',
          'serviceType': data.serviceType,
          'wasteType': data.wasteType,
          'volumeEstimate': data.volumeEstimate,
          'location': data.location,
          'accessibility': data.accessibility,
          'urgency': data.urgency,
          'contactName': data.contactInfo.name,
          'contactEmail': data.contactInfo.email,
          'contactPhone': data.contactInfo.phone,
          'contactAddress': data.contactInfo.address,
          'estimatedPrice': data.estimatedPrice.toString(),
          'quoteId': quoteId,
          'submitted-from': window.location.href,
          'submission-time': new Date().toISOString(),
          'form-type': 'quote'
        }).toString()
      });

      if (response.ok) {
        return { success: true, quoteId };
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to submit quote. Please call us directly at 07775 605848 or email hello@1clickclearance.co.uk'
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-brand-dark mb-4">Get Your Instant Quote</h1>
            <p className="text-xl text-gray-600">Quick, easy, and accurate pricing in just a few steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-brand-green' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Service</span>
              <span>Details</span>
              <span>Access</span>
              <span>Quote</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">



          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700">{submitMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Step 1: Service Type */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">What type of service do you need?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleInputChange('serviceType', service.id)}
                    className={`p-6 rounded-lg border-2 text-left transition-all duration-200 ${
                      formData.serviceType === service.id
                        ? 'border-brand-green bg-green-50'
                        : 'border-gray-200 hover:border-brand-green'
                    }`}
                  >
                    <h3 className="font-semibold text-brand-dark mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600">Starting from £{service.basePrice}</p>
                  </button>
                ))}
              </div>
              {getFieldError('serviceType') && (
                <p className="mt-4 text-sm text-red-600">{getFieldError('serviceType')}</p>
              )}
            </div>
          )}

          {/* Step 2: Waste Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Tell us about your waste</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">
                    What type of waste do you have? *
                  </label>
                  <select
                    value={formData.wasteType as string}
                    onChange={(e) => handleInputChange('wasteType', e.target.value)}
                    onBlur={() => handleFieldBlur('wasteType')}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                      isFieldInvalid('wasteType') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select waste type</option>
                    {wasteTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {getFieldError('wasteType') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('wasteType')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">
                    Estimated volume *
                  </label>
                  <div className="space-y-3">
                    {volumeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('volumeEstimate', option.value)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          formData.volumeEstimate === option.value
                            ? 'border-brand-green bg-green-50'
                            : 'border-gray-200 hover:border-brand-green'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {getFieldError('volumeEstimate') && (
                    <p className="mt-3 text-sm text-red-600">{getFieldError('volumeEstimate')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">
                    Your location (postcode or area) *
                  </label>
                  <input
                    type="text"
                    value={formData.location as string}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onBlur={() => handleFieldBlur('location')}
                    placeholder="e.g. SW1A 1AA or Central London"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                      isFieldInvalid('location') ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('location') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('location')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Access & Timing */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Access and timing details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">
                    How accessible is the location? *
                  </label>
                  <div className="space-y-3">
                    {accessibilityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('accessibility', option.value)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          formData.accessibility === option.value
                            ? 'border-brand-green bg-green-50'
                            : 'border-gray-200 hover:border-brand-green'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {getFieldError('accessibility') && (
                    <p className="mt-3 text-sm text-red-600">{getFieldError('accessibility')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-3">
                    When do you need the clearance? *
                  </label>
                  <div className="space-y-3">
                    {urgencyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('urgency', option.value)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          formData.urgency === option.value
                            ? 'border-brand-green bg-green-50'
                            : 'border-gray-200 hover:border-brand-green'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {getFieldError('urgency') && (
                    <p className="mt-3 text-sm text-red-600">{getFieldError('urgency')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Quote & Contact */}
          {currentStep === 4 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Your Estimated Quote</h2>
                <div className="bg-brand-green text-white rounded-lg p-8 mb-8">
                  <div className="text-4xl font-bold mb-2">£{estimatedPrice}</div>
                  <p className="text-lg">All inclusive price</p>
                  <p className="text-sm opacity-90">No hidden fees • Professional service • Eco-friendly disposal</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-dark">Get your official quote</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={(formData.contactInfo as any)?.name || ''}
                      onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                      onBlur={() => handleFieldBlur('contactInfo.name')}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        isFieldInvalid('contactInfo.name') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {getFieldError('contactInfo.name') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('contactInfo.name')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={(formData.contactInfo as any)?.email || ''}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                      onBlur={() => handleFieldBlur('contactInfo.email')}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        isFieldInvalid('contactInfo.email') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {getFieldError('contactInfo.email') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('contactInfo.email')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={(formData.contactInfo as any)?.phone || ''}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                      onBlur={() => handleFieldBlur('contactInfo.phone')}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        isFieldInvalid('contactInfo.phone') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                      placeholder="e.g. 020 7123 4567"
                    />
                    {getFieldError('contactInfo.phone') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('contactInfo.phone')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">Full Address *</label>
                    <input
                      type="text"
                      value={(formData.contactInfo as any)?.address || ''}
                      onChange={(e) => handleInputChange('contactInfo.address', e.target.value)}
                      onBlur={() => handleFieldBlur('contactInfo.address')}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        isFieldInvalid('contactInfo.address') ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                      placeholder="Full collection address"
                    />
                    {getFieldError('contactInfo.address') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('contactInfo.address')}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || submitStatus === 'success'}
                  className={`w-full text-lg py-4 mt-6 font-semibold rounded-md transition-all duration-200 ${
                    isSubmitting || submitStatus === 'success'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-primary hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Submitting Quote...
                    </div>
                  ) : submitStatus === 'success' ? (
                    'Quote Submitted!'
                  ) : (
                    `Book Now - £${estimatedPrice}`
                  )}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Or call us directly at <a href="tel:07775605848" className="text-brand-green font-semibold">07775 605848</a>
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {submitStatus !== 'success' && (
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 4 && (
                <button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotePage;
