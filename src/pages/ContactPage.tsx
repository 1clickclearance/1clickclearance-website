import type React from 'react';
import { useState, useEffect } from 'react';
import { CONTACT_FORM_RULES, useFormValidation } from '../utils/validation';
import { trackFormStart, trackFormSubmit, trackFormSuccess, trackFormError, analytics } from '../utils/analytics';

const ContactPage = () => {
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
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  }, CONTACT_FORM_RULES);

  // Track form start when component mounts
  useEffect(() => {
    trackFormStart('contact_form');
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validation = validateAll();

    if (!validation.isValid) {
      // Track validation errors
      for (const [field, fieldErrors] of Object.entries(validation.errors)) {
        if (fieldErrors.length > 0) {
          analytics.trackFormValidationError('contact_form', field, fieldErrors[0]);
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Track form submission
      trackFormSubmit('contact_form', formData);

      // Simulate API call - replace with actual endpoint
      const response = await submitContactForm(formData);

      if (response.success) {
        trackFormSuccess('contact_form', { response_time: Date.now() });
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
        reset(); // Clear the form
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      trackFormError('contact_form', errorMessage);
      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Netlify Forms submission
  const submitContactForm = async (data: typeof formData): Promise<{success: boolean, error?: string}> => {
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact-form-v2',
          'name': data.name as string,
          'email': data.email as string,
          'phone': data.phone as string,
          'subject': data.subject as string,
          'message': data.message as string,
          'submitted-from': window.location.href,
          'submission-time': new Date().toISOString(),
          'form-type': 'contact'
        }).toString()
      });

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send message. Please call us directly at 07775 605848 or email hello@1clickclearance.co.uk'
      };
    }
  };

  const handleFieldChange = (field: string, value: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to book or have questions? We're here to help 24/7 with instant quotes and expert advice.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Send us a message</h2>



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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-brand-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name as string}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleFieldBlur('name')}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                      isFieldInvalid('name') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {getFieldError('name') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-dark mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email as string}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                      isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {getFieldError('email') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-brand-dark mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone as string}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    onBlur={() => handleFieldBlur('phone')}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                      isFieldInvalid('phone') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                    placeholder="e.g. 020 7123 4567"
                  />
                  {getFieldError('phone') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-brand-dark mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject as string}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    onBlur={() => handleFieldBlur('subject')}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                      isFieldInvalid('subject') ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a subject</option>
                    <option value="quote">Request Quote</option>
                    <option value="booking">Existing Booking</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Business Partnership</option>
                  </select>
                  {getFieldError('subject') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('subject')}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-brand-dark mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message as string}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  onBlur={() => handleFieldBlur('message')}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
                    isFieldInvalid('message') ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us how we can help you..."
                  disabled={isSubmitting}
                />
                {getFieldError('message') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('message')}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {(formData.message as string).length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className={`w-full py-3 text-lg font-semibold rounded-md transition-all duration-200 ${
                  isSubmitting || submitStatus === 'success'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-primary hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Sending Message...
                  </div>
                ) : submitStatus === 'success' ? (
                  'Message Sent!'
                ) : (
                  'Send Message'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">

            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Quick Contact</h2>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-brand-green text-white p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">Call Us</h3>
                    <a href="tel:07775605848" className="text-brand-green hover:text-brand-dark text-lg font-semibold">
                      07775 605848
                    </a>
                    <p className="text-sm text-gray-600">Available 24/7 for instant quotes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-brand-green text-white p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">Email Us</h3>
                    <a href="mailto:hello@1clickclearance.co.uk" className="text-brand-green hover:text-brand-dark">
                      hello@1clickclearance.co.uk
                    </a>
                    <p className="text-sm text-gray-600">We respond within 1 hour</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-brand-green text-white p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">Service Areas</h3>
                    <p className="text-brand-green">Cambridgeshire, Suffolk, Essex & More</p>
                    <p className="text-sm text-gray-600">Contact us for other areas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-brand-green text-white p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-dark">Operating Hours</h3>
                    <p className="text-brand-green">24/7 Online Booking</p>
                    <p className="text-sm text-gray-600">Phone: Mon-Sun 7AM-9PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Service Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="https://ugc.same-assets.com/ocBAjWUMtV2WUqsq8-_dnzfJJJVax6DF.png"
                alt="1clickclearance professional team loading appliances into our branded van"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-dark mb-2">Professional Clearance Service</h3>
                <p className="text-gray-600">
                  Our experienced team provides reliable house clearance and waste removal services
                  across Cambridgeshire, Suffolk, Essex and surrounding areas. Fully licensed,
                  insured and environmentally responsible.
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-6">Follow Us</h2>

              <div className="flex space-x-4">
                <a href="https://instagram.com/1clickclearance" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="bg-brand-green text-white p-3 rounded-full hover:bg-brand-dark transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com/@1clickclearance" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok" className="bg-brand-green text-white p-3 rounded-full hover:bg-brand-dark transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Follow us for updates, tips, and sustainability insights from the waste clearance industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
