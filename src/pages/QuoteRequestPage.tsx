import type React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackFormStart, trackFormSubmit, trackFormSuccess, trackFormError } from '../utils/analytics';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  siteAddress: string;
  propertyType?: string;
  description?: string;
  images: File[];
}

const QuoteRequestPage = () => {
  const location = useLocation();
  const [clearanceType, setClearanceType] = useState<string>('');
  const [showFullForm, setShowFullForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    siteAddress: '',
    propertyType: '',
    description: '',
    images: []
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Extract clearance type from URL path
    const path = location.pathname;
    if (path.includes('/residential')) {
      setClearanceType('residential');
    } else if (path.includes('/garden')) {
      setClearanceType('garden');
      setShowFullForm(true); // Skip the residential options and go straight to form
    } else if (path.includes('/business')) {
      setClearanceType('business');
      setShowFullForm(true); // Skip the residential options and go straight to form
    }

    trackFormStart('quote_request_form');
  }, [location]);

  const propertyTypes = [
    '1 Bedroom Property',
    '2 Bedroom Property',
    '3 Bedroom Property',
    '4 Bedroom Property',
    '5+ Bedroom Property',
    'Other'
  ];

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.siteAddress.trim()) newErrors.siteAddress = 'Site address is required';

    if (clearanceType === 'residential' && !formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    if (clearanceType === 'business' && !formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.images.length < 5) {
      newErrors.images = 'Please upload at least 5 images';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic UK format)
    const phoneRegex = /^(\+44|0)[0-9\s\-\(\)]{9,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 20) // Limit to 20 files total
    }));

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      trackFormSubmit('quote_request_form', formData as unknown as Record<string, unknown>);

      // Simulate API call - replace with actual endpoint
      const response = await submitQuoteRequest(formData, clearanceType);

      if (response.success) {
        trackFormSuccess('quote_request_form', { clearance_type: clearanceType });
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your quote request! We\'ll review your details and get back to you within 24 hours with a custom quote.');
      } else {
        throw new Error(response.error || 'Failed to submit quote request');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit quote request';
      trackFormError('quote_request_form', errorMessage);
      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Netlify Forms submission with file upload support
  const submitQuoteRequest = async (data: FormData, type: string): Promise<{success: boolean, error?: string}> => {
    try {
      const formData = new FormData();
      formData.append('form-name', 'quote-request-form');
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('siteAddress', data.siteAddress);
      formData.append('clearanceType', type);
      formData.append('submitted-from', window.location.href);
      formData.append('submission-time', new Date().toISOString());
      formData.append('form-type', 'quote-request');

      if (data.propertyType) {
        formData.append('propertyType', data.propertyType);
      }
      if (data.description) {
        formData.append('description', data.description);
      }

      // Add file uploads
      data.images.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      const response = await fetch('/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to submit quote request. Please call us directly at 07775 605848 or email hello@1clickclearance.co.uk'
      };
    }
  };

  const getClearanceTypeTitle = () => {
    switch (clearanceType) {
      case 'residential': return 'Residential Clearance';
      case 'garden': return 'Garden Clearance';
      case 'business': return 'Business / Office Clearance';
      default: return 'Large Job Quote';
    }
  };

  // Residential clearance options page
  if (clearanceType === 'residential' && !showFullForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6">
                Residential Clearance Options
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Choose the best option for your residential clearance needs.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Booking Option */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">Standard Booking</h3>
                <p className="text-gray-600 mb-6">
                  For room clearances, partial house clearances, or when you know exactly what items need removing.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Choose by volume (1-7 yards) or individual items
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Instant pricing and online booking
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Pay online with secure payment
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Same day service available
                </li>
              </ul>

              <a
                href="/pricing"
                className="w-full btn-primary text-center block"
              >
                Use Standard Booking
              </a>
            </div>

            {/* Full House Clearance Option */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-brand-green">
              <div className="bg-brand-green text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 text-center">
                Custom Quote Required
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">Full House Clearance</h3>
                <p className="text-gray-600 mb-6">
                  For complete house clearances, estate clearances, or large-scale projects requiring site evaluation.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Complete house clearances
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Site visit and evaluation
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom pricing based on property
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Specialized equipment available
                </li>
              </ul>

              <button
                onClick={() => setShowFullForm(true)}
                className="w-full btn-primary text-center"
              >
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main quote form
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-dark mb-4">
              {getClearanceTypeTitle()} Quote Request
            </h1>
            <p className="text-lg text-gray-600">
              {clearanceType === 'residential' && 'Complete the form below for your full house clearance quote.'}
              {clearanceType === 'garden' && 'Complete the form below for your garden clearance quote.'}
              {clearanceType === 'business' && 'Complete the form below for your business/office clearance quote.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {submitStatus === 'success' ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl text-green-500 mb-6">✓</div>
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Quote Request Submitted!</h2>
              <p className="text-gray-600 mb-8">{submitMessage}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" className="btn-primary">Return to Home</a>
                <a href="/quote-selection" className="btn-secondary">Submit Another Quote</a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">


              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g. 07775 605848"
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  {clearanceType === 'residential' && (
                    <div>
                      <label className="block text-sm font-semibold text-brand-dark mb-2">
                        Property Type *
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                          errors.propertyType ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      >
                        <option value="">Select property type</option>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Your Address *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full address"
                    disabled={isSubmitting}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    {clearanceType === 'garden' ? 'Garden' : clearanceType === 'business' ? 'Business' : 'Site'} Address *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.siteAddress}
                    onChange={(e) => handleInputChange('siteAddress', e.target.value)}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                      errors.siteAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Enter the ${clearanceType === 'garden' ? 'garden' : clearanceType === 'business' ? 'business premises' : 'clearance site'} address`}
                    disabled={isSubmitting}
                  />
                  {errors.siteAddress && <p className="mt-1 text-sm text-red-600">{errors.siteAddress}</p>}
                </div>

                {clearanceType === 'business' && (
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">
                      Please describe the clearance required *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Please provide details about the office/business clearance requirements, including types of items, furniture, equipment, approximate quantities, and any special considerations..."
                      disabled={isSubmitting}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>
                )}

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-2">
                    Upload Images/Videos * (Minimum 5 required)
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    {clearanceType === 'garden' && 'Please upload photos or videos of the garden area to be cleared, including any specific items or areas of concern.'}
                    {clearanceType === 'residential' && 'Please upload photos of the property and rooms to be cleared to help us provide an accurate quote.'}
                    {clearanceType === 'business' && 'Please upload photos of the office/business premises to be cleared, including all areas and items mentioned in your description.'}
                  </p>

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-brand-green bg-green-50' : errors.images ? 'border-red-500' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-4xl mb-4">📷</div>
                    <p className="text-lg font-semibold text-brand-dark mb-2">
                      Drag and drop files here, or click to select
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Supports: JPG, PNG, GIF, MP4, MOV (Max 10MB each)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn-secondary cursor-pointer inline-block"
                    >
                      Choose Files
                    </label>
                  </div>

                  {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}

                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-brand-dark mb-2">
                        Uploaded Files ({formData.images.length}/20):
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative bg-gray-100 rounded-lg p-2">
                            <div className="text-xs truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)}MB</div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-brand-dark mb-2">Important Notice</h4>
                  <p className="text-sm text-gray-700">
                    This is a custom quote request that requires a site evaluation. We do not provide estimated pricing
                    online for large jobs as each project is unique. Our team will review your request and contact you
                    within 24 hours to arrange a site visit and provide you with a detailed, accurate quote.
                  </p>
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700">{submitMessage}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 text-lg font-semibold rounded-md transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-primary hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Submitting Quote Request...
                    </div>
                  ) : (
                    'Submit Quote Request'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestPage;
