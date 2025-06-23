export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationErrors {
  [fieldName: string]: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+44\s?|0)[1-9]\d{8,9}$/,
  postcode: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  alphanumeric: /^[a-zA-Z0-9\s]+$/
};

// Common validation rules
export const COMMON_RULES = {
  required: (message = 'This field is required'): ValidationRule => ({
    required: true,
    message
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.email,
    message
  }),

  phone: (message = 'Please enter a valid UK phone number'): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.phone,
    message
  }),

  postcode: (message = 'Please enter a valid UK postcode'): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.postcode,
    message
  }),

  name: (message = 'Please enter a valid name (2-50 characters, letters only)'): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.name,
    minLength: 2,
    maxLength: 50,
    message
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Must be at least ${length} characters`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Must be no more than ${length} characters`
  }),

  custom: (validator: (value: unknown) => boolean, message: string): ValidationRule => ({
    custom: validator,
    message
  })
};

// Validation function
export function validateField(value: unknown, rules: ValidationRule[]): string[] {
  const errors: string[] = [];

  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(rule.message || 'This field is required');
      continue; // Skip other validations if required field is empty
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue;
    }

    // String value for string-based validations
    const stringValue = typeof value === 'string' ? value.trim() : String(value);

    // Min length validation
    if (rule.minLength && stringValue.length < rule.minLength) {
      errors.push(rule.message || `Must be at least ${rule.minLength} characters`);
    }

    // Max length validation
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      errors.push(rule.message || `Must be no more than ${rule.maxLength} characters`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      errors.push(rule.message || 'Invalid format');
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message || 'Invalid value');
    }
  }

  return errors;
}

// Validate entire form
export function validateForm(data: Record<string, unknown>, rules: ValidationRules): ValidationResult {
  const errors: ValidationErrors = {};
  let isValid = true;

  // Validate each field
  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const fieldErrors = validateField(data[fieldName], fieldRules);

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Form submission helper
export interface FormSubmissionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  validationErrors?: ValidationErrors;
}

export async function submitForm(
  formData: Record<string, unknown>,
  validationRules: ValidationRules,
  submitFunction: (data: Record<string, unknown>) => Promise<unknown>
): Promise<FormSubmissionResult> {
  try {
    // Validate form
    const validation = validateForm(formData, validationRules);

    if (!validation.isValid) {
      return {
        success: false,
        validationErrors: validation.errors
      };
    }

    // Submit form
    const result = await submitFunction(formData);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

// Contact form validation rules
export const CONTACT_FORM_RULES: ValidationRules = {
  name: [
    COMMON_RULES.required('Please enter your full name'),
    COMMON_RULES.name()
  ],
  email: [
    COMMON_RULES.required('Please enter your email address'),
    COMMON_RULES.email()
  ],
  phone: [
    COMMON_RULES.phone('Please enter a valid UK phone number (optional)')
  ],
  subject: [
    COMMON_RULES.required('Please select a subject')
  ],
  message: [
    COMMON_RULES.required('Please enter your message'),
    COMMON_RULES.minLength(10, 'Message must be at least 10 characters'),
    COMMON_RULES.maxLength(1000, 'Message must be no more than 1000 characters')
  ]
};

// Quote form validation rules
export const QUOTE_FORM_RULES: ValidationRules = {
  serviceType: [
    COMMON_RULES.required('Please select a service type')
  ],
  wasteType: [
    COMMON_RULES.required('Please select a waste type')
  ],
  volumeEstimate: [
    COMMON_RULES.required('Please select an estimated volume')
  ],
  location: [
    COMMON_RULES.required('Please enter your location'),
    COMMON_RULES.minLength(3, 'Location must be at least 3 characters')
  ],
  accessibility: [
    COMMON_RULES.required('Please select accessibility level')
  ],
  urgency: [
    COMMON_RULES.required('Please select urgency level')
  ],
  'contactInfo.name': [
    COMMON_RULES.required('Please enter your full name'),
    COMMON_RULES.name()
  ],
  'contactInfo.email': [
    COMMON_RULES.required('Please enter your email address'),
    COMMON_RULES.email()
  ],
  'contactInfo.phone': [
    COMMON_RULES.required('Please enter your phone number'),
    COMMON_RULES.phone()
  ],
  'contactInfo.address': [
    COMMON_RULES.required('Please enter your full address'),
    COMMON_RULES.minLength(10, 'Address must be at least 10 characters')
  ]
};

// Helper to get nested field value
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: Record<string, unknown> | unknown, key) =>
    (current && typeof current === 'object' && current !== null) ?
      (current as Record<string, unknown>)[key] : undefined, obj);
}

// Helper to set nested field value
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  const lastKey = keys.pop();
  if (!lastKey) return;

  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key] as Record<string, unknown>;
  }, obj);
  target[lastKey] = value;
}

// Real-time validation hook for React components
export function useFormValidation(
  initialData: Record<string, unknown>,
  validationRules: ValidationRules
) {
  const [data, setData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateSingleField = (fieldName: string, value: unknown) => {
    const fieldRules = validationRules[fieldName];
    if (!fieldRules) return [];

    return validateField(value, fieldRules);
  };

  const updateField = (fieldName: string, value: unknown) => {
    // Update data
    const newData = { ...data };
    if (fieldName.includes('.')) {
      setNestedValue(newData, fieldName, value);
    } else {
      newData[fieldName] = value;
    }
    setData(newData);

    // Validate field if it has been touched
    if (touched[fieldName]) {
      const fieldErrors = validateSingleField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors
      }));
    }
  };

  const touchField = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate the field
    const value = fieldName.includes('.')
      ? getNestedValue(data, fieldName)
      : data[fieldName];
    const fieldErrors = validateSingleField(fieldName, value);

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors
    }));
  };

  const validateAll = () => {
    const validation = validateForm(data, validationRules);
    setErrors(validation.errors);

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    for (const field of Object.keys(validationRules)) {
      allTouched[field] = true;
    }
    setTouched(allTouched);

    return validation;
  };

  const reset = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    updateField,
    touchField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(err => err.length === 0)
  };
}

// Import React for the hook
import React from 'react';
