// XSS Protection utilities for securing dynamic content and user inputs

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  // Basic HTML entity encoding
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize CSS values to prevent CSS injection
 */
export const sanitizeCssValue = (value: string): string => {
  // Remove potentially dangerous CSS constructs
  return value
    .replace(/javascript:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(/gi, '')
    .replace(/import\s*[@"']/gi, '')
    .replace(/@import/gi, '')
    .replace(/behavior\s*:/gi, '');
};

/**
 * Validate and sanitize color values for CSS
 */
export const sanitizeColorValue = (color: string): string => {
  // Allow only safe color formats
  const safeColorRegex = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|transparent|inherit|initial|unset|[a-zA-Z]+)$/;
  
  if (!safeColorRegex.test(color)) {
    console.warn('Potentially unsafe color value detected:', color);
    return 'transparent'; // Safe fallback
  }
  
  return color;
};

/**
 * Secure CSS generation for chart themes
 */
export const generateSecureCSS = (themeConfig: Record<string, any>): string => {
  const safeCssRules: string[] = [];
  
  Object.entries(themeConfig).forEach(([selector, rules]) => {
    // Sanitize selector
    const safeSelector = sanitizeHtml(selector);
    
    if (typeof rules === 'object' && rules !== null) {
      const safeRules: string[] = [];
      
      Object.entries(rules).forEach(([property, value]) => {
        if (typeof value === 'string') {
          // Sanitize CSS property and value
          const safeProperty = property.replace(/[^a-zA-Z0-9-]/g, '');
          const safeValue = sanitizeCssValue(value);
          
          // Additional validation for color properties
          if (property.includes('color') || property.includes('background') || property.includes('border')) {
            const sanitizedColor = sanitizeColorValue(safeValue);
            safeRules.push(`  ${safeProperty}: ${sanitizedColor};`);
          } else {
            safeRules.push(`  ${safeProperty}: ${safeValue};`);
          }
        }
      });
      
      if (safeRules.length > 0) {
        safeCssRules.push(`${safeSelector} {\n${safeRules.join('\n')}\n}`);
      }
    }
  });
  
  return safeCssRules.join('\n\n');
};

/**
 * Content Security Policy headers for XSS protection
 */
export const getCSPHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // React needs unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'", // Styled components need unsafe-inline
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://arnowuvckpxpeavrcbri.supabase.co wss://arnowuvckpxpeavrcbri.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  };
};

/**
 * Validate user input for potential XSS attempts
 */
export const validateUserInput = (input: string, maxLength: number = 1000): {
  isValid: boolean;
  sanitized: string;
  warnings: string[];
} => {
  const warnings: string[] = [];
  let isValid = true;
  
  // Check length
  if (input.length > maxLength) {
    warnings.push(`Input exceeds maximum length of ${maxLength} characters`);
    isValid = false;
  }
  
  // Check for potential script tags
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input)) {
    warnings.push('Script tags detected in input');
    isValid = false;
  }
  
  // Check for javascript: protocol
  if (/javascript:/gi.test(input)) {
    warnings.push('JavaScript protocol detected in input');
    isValid = false;
  }
  
  // Check for data: URLs with potential scripts
  if (/data:\s*text\/html/gi.test(input)) {
    warnings.push('Potentially dangerous data URL detected');
    isValid = false;
  }
  
  // Sanitize the input
  const sanitized = sanitizeHtml(input);
  
  return {
    isValid,
    sanitized,
    warnings
  };
};