// Postcode validation utility for service area coverage

// Coverage areas - first 3-4 characters of postcodes
// 20-mile radius around CB21 4RJ (Shudy Camps)
export const COVERAGE_AREAS = [
  // Cambridge and surrounding areas
  'CB1', 'CB2', 'CB3', 'CB4', 'CB5', 'CB6', 'CB7', 'CB8', 'CB9',
  'CB10', 'CB11', 'CB21', 'CB22', 'CB23', 'CB24', 'CB25',

  // Essex areas
  'CO10', 'CO9', 'CM7', 'CM6', 'CM22', 'CM23',

  // Suffolk areas
  'IP28', 'IP29', 'IP32', 'IP33',

  // Hertfordshire areas
  'SG8', 'SG9',
];

export interface PostcodeValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  area?: string;
}

/**
 * Validates if a postcode is within our service coverage area
 * @param postcode - The postcode to validate
 * @returns PostcodeValidationResult
 */
export const validatePostcode = (postcode: string): PostcodeValidationResult => {
  // Clean the postcode - remove spaces and convert to uppercase
  const cleanPostcode = postcode.trim().toUpperCase().replace(/\s/g, '');

  if (cleanPostcode.length < 2) {
    return {
      isValid: false,
      message: 'Please enter a valid postcode',
      type: 'error'
    };
  }

  // Extract first 2-4 characters for matching (more flexible matching)
  const prefix2 = cleanPostcode.substring(0, 2);
  const prefix3 = cleanPostcode.substring(0, 3);
  const prefix4 = cleanPostcode.substring(0, 4);

  // Check if postcode prefix is in our coverage areas
  const isInCoverage = COVERAGE_AREAS.includes(prefix2) || COVERAGE_AREAS.includes(prefix3) || COVERAGE_AREAS.includes(prefix4);

  if (isInCoverage) {
    // Determine the area for more specific messaging
    let area = 'our service area';
    if (prefix2.startsWith('CB') || prefix3.startsWith('CB') || prefix4.startsWith('CB')) {
      area = 'Cambridge area';
    } else if (['CO', 'CM'].some(prefix => prefix2.startsWith(prefix) || prefix3.startsWith(prefix))) {
      area = 'Essex area';
    } else if (prefix2.startsWith('IP') || prefix3.startsWith('IP')) {
      area = 'Suffolk area';
    } else if (prefix2.startsWith('SG') || prefix3.startsWith('SG')) {
      area = 'Hertfordshire area';
    }

    return {
      isValid: true,
      message: `Great! We provide instant online bookings in the ${area}.`,
      type: 'success',
      area
    };
  }

  return {
    isValid: false,
    message: 'Unfortunately you are currently out of the area we can provide immediate online bookings for. Please use our quote form to tell us what you need and where you are located and we will do our best to help.',
    type: 'info'
  };
};

/**
 * Quick check if a postcode is in coverage (for simpler validation)
 * @param postcode - The postcode to check
 * @returns boolean
 */
export const isPostcodeInCoverage = (postcode: string): boolean => {
  const result = validatePostcode(postcode);
  return result.isValid;
};

/**
 * Get coverage area name from postcode
 * @param postcode - The postcode to check
 * @returns string - Area name or 'Unknown'
 */
export const getCoverageAreaName = (postcode: string): string => {
  const result = validatePostcode(postcode);
  return result.area || 'Unknown';
};
