// Analytics and conversion tracking utility

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_data?: Record<string, unknown>;
}

class Analytics {
  private isDebugMode = false;

  constructor(debugMode = false) {
    this.isDebugMode = debugMode;
  }

  // Track general events
  track(event: AnalyticsEvent) {
    if (this.isDebugMode) {
      console.log('📊 Analytics Event:', event);
    }

    // In a real implementation, you would send to your analytics provider
    // Example integrations:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - Custom analytics endpoint

    try {
      // Google Analytics 4 example
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_parameters: event.custom_data
        });
      }

      // Custom analytics endpoint example
      if (typeof window !== 'undefined') {
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId()
          })
        }).catch(() => {
          // Silently fail analytics tracking
        });
      }
    } catch (error) {
      // Don't let analytics failures break the app
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Form-specific tracking methods
  trackFormStart(formType: string, formData?: Record<string, unknown>) {
    this.track({
      event: 'form_start',
      category: 'forms',
      action: 'start',
      label: formType,
      custom_data: {
        form_type: formType,
        ...formData
      }
    });
  }

  trackFormProgress(formType: string, step: string | number, totalSteps?: number) {
    this.track({
      event: 'form_progress',
      category: 'forms',
      action: 'progress',
      label: formType,
      value: typeof step === 'number' ? step : undefined,
      custom_data: {
        form_type: formType,
        current_step: step,
        total_steps: totalSteps,
        completion_rate: totalSteps ? (typeof step === 'number' ? step / totalSteps : 0) : undefined
      }
    });
  }

  trackFormValidationError(formType: string, field: string, errorType: string) {
    this.track({
      event: 'form_validation_error',
      category: 'forms',
      action: 'validation_error',
      label: formType,
      custom_data: {
        form_type: formType,
        field,
        error_type: errorType
      }
    });
  }

  trackFormSubmit(formType: string, formData: Record<string, unknown>) {
    this.track({
      event: 'form_submit',
      category: 'forms',
      action: 'submit',
      label: formType,
      custom_data: {
        form_type: formType,
        form_data: this.sanitizeFormData(formData)
      }
    });
  }

  trackFormSuccess(formType: string, responseData?: Record<string, unknown>) {
    this.track({
      event: 'form_success',
      category: 'conversions',
      action: 'submit_success',
      label: formType,
      value: 1,
      custom_data: {
        form_type: formType,
        ...responseData
      }
    });
  }

  trackFormError(formType: string, error: string) {
    this.track({
      event: 'form_error',
      category: 'forms',
      action: 'submit_error',
      label: formType,
      custom_data: {
        form_type: formType,
        error
      }
    });
  }

  // Quote-specific tracking
  trackQuoteStart(quoteData: Record<string, unknown>) {
    this.track({
      event: 'quote_start',
      category: 'quotes',
      action: 'start',
      label: 'quote_calculator',
      custom_data: {
        service_type: quoteData.serviceType,
        ...quoteData
      }
    });
  }

  trackQuoteCalculation(quoteData: Record<string, unknown>, estimatedPrice: number) {
    this.track({
      event: 'quote_calculation',
      category: 'quotes',
      action: 'calculate',
      label: 'quote_calculator',
      value: estimatedPrice,
      custom_data: {
        estimated_price: estimatedPrice,
        ...quoteData
      }
    });
  }

  trackQuoteConversion(quoteData: Record<string, unknown>, finalPrice: number) {
    this.track({
      event: 'quote_conversion',
      category: 'conversions',
      action: 'quote_to_booking',
      label: 'quote_calculator',
      value: finalPrice,
      custom_data: {
        final_price: finalPrice,
        conversion_value: finalPrice,
        ...quoteData
      }
    });
  }

  // Calculator-specific tracking
  trackCalculatorInteraction(action: string, itemData?: Record<string, unknown>) {
    this.track({
      event: 'calculator_interaction',
      category: 'calculator',
      action,
      label: 'item_calculator',
      custom_data: itemData
    });
  }

  trackCalculatorConversion(selectedItems: Record<string, number>, totalPrice: number) {
    this.track({
      event: 'calculator_conversion',
      category: 'conversions',
      action: 'calculator_to_booking',
      label: 'item_calculator',
      value: totalPrice,
      custom_data: {
        selected_items: selectedItems,
        total_price: totalPrice,
        item_count: Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0)
      }
    });
  }

  // Page tracking
  trackPageView(page: string, additionalData?: Record<string, unknown>) {
    this.track({
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: page,
      custom_data: {
        page,
        ...additionalData
      }
    });
  }

  // CTA tracking
  trackCTAClick(ctaType: string, location: string, destination?: string) {
    this.track({
      event: 'cta_click',
      category: 'engagement',
      action: 'click',
      label: ctaType,
      custom_data: {
        cta_type: ctaType,
        location,
        destination
      }
    });
  }

  // Helper methods
  private sanitizeFormData(formData: Record<string, unknown>): Record<string, unknown> {
    // Remove sensitive information but keep useful metadata
    const sanitized = { ...formData };

    // Remove actual contact information but keep data types and lengths
    if (sanitized.email && typeof sanitized.email === 'string') {
      const emailStr = sanitized.email as string;
      sanitized.email_provided = true;
      const emailParts = emailStr.split('@');
      if (emailParts.length > 1) {
        sanitized.email_domain = emailParts[1];
      }
      sanitized.email = undefined;
    }

    if (sanitized.phone && typeof sanitized.phone === 'string') {
      const phoneStr = sanitized.phone as string;
      sanitized.phone_provided = true;
      sanitized.phone_length = phoneStr.length;
      sanitized.phone = undefined;
    }

    if (sanitized.name && typeof sanitized.name === 'string') {
      const nameStr = sanitized.name as string;
      sanitized.name_provided = true;
      sanitized.name_length = nameStr.length;
      sanitized.name = undefined;
    }

    if (sanitized.address) {
      sanitized.address_provided = true;
      sanitized.address = undefined;
    }

    return sanitized;
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }
}

// Create singleton instance
export const analytics = new Analytics(process.env.NODE_ENV === 'development');

// Convenience functions for easy imports
export const trackFormStart = (formType: string, formData?: Record<string, unknown>) =>
  analytics.trackFormStart(formType, formData);

export const trackFormProgress = (formType: string, step: string | number, totalSteps?: number) =>
  analytics.trackFormProgress(formType, step, totalSteps);

export const trackFormSubmit = (formType: string, formData: Record<string, unknown>) =>
  analytics.trackFormSubmit(formType, formData);

export const trackFormSuccess = (formType: string, responseData?: Record<string, unknown>) =>
  analytics.trackFormSuccess(formType, responseData);

export const trackFormError = (formType: string, error: string) =>
  analytics.trackFormError(formType, error);

export const trackQuoteStart = (quoteData: Record<string, unknown>) =>
  analytics.trackQuoteStart(quoteData);

export const trackQuoteCalculation = (quoteData: Record<string, unknown>, estimatedPrice: number) =>
  analytics.trackQuoteCalculation(quoteData, estimatedPrice);

export const trackQuoteConversion = (quoteData: Record<string, unknown>, finalPrice: number) =>
  analytics.trackQuoteConversion(quoteData, finalPrice);

export const trackCalculatorInteraction = (action: string, itemData?: Record<string, unknown>) =>
  analytics.trackCalculatorInteraction(action, itemData);

export const trackCalculatorConversion = (selectedItems: Record<string, number>, totalPrice: number) =>
  analytics.trackCalculatorConversion(selectedItems, totalPrice);

export const trackPageView = (page: string, additionalData?: Record<string, unknown>) =>
  analytics.trackPageView(page, additionalData);

export const trackCTAClick = (ctaType: string, location: string, destination?: string) =>
  analytics.trackCTAClick(ctaType, location, destination);

export default analytics;
