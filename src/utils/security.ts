// Security utilities and validation functions
export class SecurityManager {
  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Email validation with security checks
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const sanitized = this.sanitizeInput(email);
    return emailRegex.test(sanitized) && sanitized.length < 255;
  }

  // Phone validation
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const sanitized = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(sanitized);
  }

  // Amount validation for payments
  static validateAmount(amount: string | number): boolean {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000000; // Max €1M
  }

  // Generate secure transaction ID
  static generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `FVD-${timestamp}-${random}`.toUpperCase();
  }

  // Rate limiting simulation (in production, use server-side)
  static checkRateLimit(action: string): boolean {
    const key = `rateLimit_${action}`;
    const now = Date.now();
    const lastAction = localStorage.getItem(key);
    
    if (lastAction && now - parseInt(lastAction) < 60000) { // 1 minute cooldown
      return false;
    }
    
    localStorage.setItem(key, now.toString());
    return true;
  }

  // Validate IBAN format (European standard)
  static validateIBAN(iban: string): boolean {
    const cleanIban = iban.replace(/\s/g, '').toUpperCase();
    
    // Basic format check
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/.test(cleanIban)) {
      return false;
    }
    
    // Spanish IBAN specific validation
    if (cleanIban.startsWith('ES')) {
      return cleanIban.length === 24;
    }
    
    // General IBAN length validation
    return cleanIban.length >= 15 && cleanIban.length <= 34;
  }

  // Encrypt sensitive data (basic client-side encryption for demo)
  static encryptData(data: string): string {
    // In production, use proper encryption libraries
    return btoa(data); // Basic base64 encoding for demo
  }

  // Decrypt sensitive data
  static decryptData(encryptedData: string): string {
    try {
      return atob(encryptedData);
    } catch {
      return '';
    }
  }
}

// Payment security class with real validation
export class PaymentSecurity {
  // Validate credit card number using Luhn algorithm
  static validateCreditCard(cardNumber: string): boolean {
    const num = cardNumber.replace(/\s/g, '');
    
    // Check if it's a valid format (13-19 digits)
    if (!/^\d{13,19}$/.test(num)) return false;

    // Luhn algorithm implementation
    let sum = 0;
    let isEven = false;
    
    // Process digits from right to left
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    // Valid if sum is divisible by 10
    return sum % 10 === 0;
  }

  // Validate CVV (3-4 digits)
  static validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Validate expiry date (must be in the future)
  static validateExpiryDate(month: string, year: string): boolean {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 2024 || yearNum > 2040) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Check if the card has expired
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    
    return true;
  }

  // Generate secure payment token
  static generatePaymentToken(): string {
    return SecurityManager.generateTransactionId();
  }

  // Validate card type based on number
  static getCardType(cardNumber: string): string {
    const num = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'American Express';
    if (/^6/.test(num)) return 'Discover';
    
    return 'Unknown';
  }

  // Check if card number passes basic validation
  static isValidCardFormat(cardNumber: string): boolean {
    const num = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(num);
  }
}