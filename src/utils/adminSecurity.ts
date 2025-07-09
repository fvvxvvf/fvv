// Advanced security system for admin access
import { TwilioSMS } from './twilioSMS';

export interface AdminSession {
  isAuthenticated: boolean;
  sessionToken: string;
  expiresAt: number;
  lastActivity: number;
  attempts: number;
  lockedUntil?: number;
}

export interface SecurityConfig {
  maxAttempts: number;
  lockoutDuration: number; // minutes
  sessionTimeout: number; // minutes
  passwordMinLength: number;
  require2FA: boolean;
}

export class AdminSecurity {
  private static readonly STORAGE_KEY = 'fvd_admin_session';
  private static readonly PASSWORD_KEY = 'fvd_admin_password';
  private static readonly ATTEMPTS_KEY = 'fvd_admin_attempts';
  private static readonly CONFIG: SecurityConfig = {
    maxAttempts: 3,
    lockoutDuration: 30,
    sessionTimeout: 60,
    passwordMinLength: 12,
    require2FA: true
  };

  // Advanced encryption using Web Crypto API
  private static async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private static async encryptData(data: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const key = await this.generateKey(password, salt);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(data)
    );

    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  private static async decryptData(encryptedData: string, password: string): Promise<string> {
    try {
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
      
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);

      const key = await this.generateKey(password, salt);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  // Password strength validation
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.CONFIG.passwordMinLength) {
      errors.push(`Password must be at least ${this.CONFIG.passwordMinLength} characters long`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Hash password with salt
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'fvdrones_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Set up admin password (first time only)
  static async setupPassword(password: string): Promise<{ success: boolean; error?: string }> {
    const validation = this.validatePasswordStrength(password);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('. ') };
    }

    try {
      const hashedPassword = await this.hashPassword(password);
      const encryptedHash = await this.encryptData(hashedPassword, password);
      
      localStorage.setItem(this.PASSWORD_KEY, encryptedHash);
      localStorage.removeItem(this.ATTEMPTS_KEY); // Reset attempts
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to setup password' };
    }
  }

  // Check if password is set up
  static isPasswordSetup(): boolean {
    return !!localStorage.getItem(this.PASSWORD_KEY);
  }

  // Get current attempts and lockout status
  private static getAttemptData(): { attempts: number; lockedUntil?: number } {
    try {
      const data = localStorage.getItem(this.ATTEMPTS_KEY);
      return data ? JSON.parse(data) : { attempts: 0 };
    } catch {
      return { attempts: 0 };
    }
  }

  // Update attempt data
  private static setAttemptData(attempts: number, lockedUntil?: number): void {
    const data = { attempts, lockedUntil };
    localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(data));
  }

  // Check if account is locked
  static isAccountLocked(): { locked: boolean; remainingTime?: number } {
    const attemptData = this.getAttemptData();
    
    if (attemptData.lockedUntil && attemptData.lockedUntil > Date.now()) {
      const remainingTime = Math.ceil((attemptData.lockedUntil - Date.now()) / 1000 / 60);
      return { locked: true, remainingTime };
    }

    return { locked: false };
  }

  // Generate secure session token
  private static generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Verify password and create session
  static async verifyPassword(password: string): Promise<{ success: boolean; error?: string; requiresOTP?: boolean }> {
    const lockStatus = this.isAccountLocked();
    if (lockStatus.locked) {
      return { 
        success: false, 
        error: `Account locked. Try again in ${lockStatus.remainingTime} minutes.` 
      };
    }

    try {
      const storedEncryptedHash = localStorage.getItem(this.PASSWORD_KEY);
      if (!storedEncryptedHash) {
        return { success: false, error: 'No password set up' };
      }

      const storedHash = await this.decryptData(storedEncryptedHash, password);
      const inputHash = await this.hashPassword(password);

      if (storedHash === inputHash) {
        // Reset attempts on successful password
        this.setAttemptData(0);
        
        if (this.CONFIG.require2FA) {
          return { success: true, requiresOTP: true };
        } else {
          // Create session directly if 2FA is disabled
          const session = this.createSession();
          return { success: true };
        }
      } else {
        // Increment failed attempts
        const attemptData = this.getAttemptData();
        const newAttempts = attemptData.attempts + 1;
        
        if (newAttempts >= this.CONFIG.maxAttempts) {
          const lockedUntil = Date.now() + (this.CONFIG.lockoutDuration * 60 * 1000);
          this.setAttemptData(newAttempts, lockedUntil);
          return { 
            success: false, 
            error: `Too many failed attempts. Account locked for ${this.CONFIG.lockoutDuration} minutes.` 
          };
        } else {
          this.setAttemptData(newAttempts);
          const remaining = this.CONFIG.maxAttempts - newAttempts;
          return { 
            success: false, 
            error: `Invalid password. ${remaining} attempts remaining.` 
          };
        }
      }
    } catch (error) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Send OTP via SMS (simulated)
  static async sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string; otpCode?: string; method?: string }> {
    // Try to send via Twilio Verify service first
    try {
      console.log('🔐 Attempting to send verification code via Twilio Verify...');
      const twilioResult = await TwilioSMS.sendVerificationCode(phoneNumber);
      
      if (twilioResult.success) {
        console.log(`✅ Verification code sent successfully via Twilio Verify to ${phoneNumber}`);
        return { 
          success: true, 
          method: 'twilio-verify'
        };
      } else {
        console.warn('⚠️ Twilio Verify failed, falling back to demo mode:', twilioResult.error);
      }
    } catch (error) {
      console.warn('⚠️ Twilio Verify error, using demo mode:', error);
    }
    
    // Fallback to demo mode with generated OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const otpData = {
      code: otpCode,
      expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
      phoneNumber: phoneNumber
    };
    
    sessionStorage.setItem('fvd_otp_data', JSON.stringify(otpData));
    
    console.log(`🔐 Demo Mode - OTP Code: ${otpCode}`);
    alert(`Demo Mode: Your OTP code is ${otpCode}\n\n(This would normally be sent via SMS to ${phoneNumber})`);
    
    return { 
      success: true, 
      otpCode, // Only for demo mode
      method: 'demo'
    };
  }

  // Verify OTP and create session
  static verifyOTP(inputCode: string): { success: boolean; error?: string } {
    // First try Twilio Verify service
    const phoneNumber = '+34677085145'; // Your phone number
    
    // Check if we should use Twilio Verify
    const shouldUseTwilioVerify = !sessionStorage.getItem('fvd_otp_data');
    
    if (shouldUseTwilioVerify) {
      // Use Twilio Verify API to check the code
      return this.verifyTwilioCode(phoneNumber, inputCode);
    }
    
    // Fallback to demo mode verification
    try {
      const otpData = sessionStorage.getItem('fvd_otp_data');
      if (!otpData) {
        return { success: false, error: 'No OTP found. Please request a new code.' };
      }

      const { code, expiresAt } = JSON.parse(otpData);
      
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem('fvd_otp_data');
        return { success: false, error: 'OTP code has expired. Please request a new code.' };
      }

      if (inputCode === code) {
        sessionStorage.removeItem('fvd_otp_data');
        this.createSession();
        return { success: true };
      } else {
        return { success: false, error: 'Invalid OTP code. Please try again.' };
      }
    } catch (error) {
      return { success: false, error: 'OTP verification failed' };
    }
  }

  // Verify code using Twilio Verify API
  private static async verifyTwilioCode(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await TwilioSMS.verifyCode(phoneNumber, code);
      
      if (result.success) {
        this.createSession();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Invalid verification code' };
      }
    } catch (error) {
      console.error('❌ Twilio verification error:', error);
      return { success: false, error: 'Verification service unavailable' };
    }
  }

  // Create authenticated session
  private static createSession(): AdminSession {
    const session: AdminSession = {
      isAuthenticated: true,
      sessionToken: this.generateSessionToken(),
      expiresAt: Date.now() + (this.CONFIG.sessionTimeout * 60 * 1000),
      lastActivity: Date.now(),
      attempts: 0
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  // Get current session
  static getCurrentSession(): AdminSession | null {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY);
      if (!sessionData) return null;

      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      // Update last activity
      session.lastActivity = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));

      return session;
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const session = this.getCurrentSession();
    return session?.isAuthenticated || false;
  }

  // Logout and clear session
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem('fvd_otp_data');
  }

  // Reset password functionality
  static async resetPassword(): Promise<{ success: boolean; error?: string }> {
    try {
      // Send reset code via SMS
      const phoneNumber = '+34677085145'; // Your phone number
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store reset data
      const resetData = {
        code: resetCode,
        expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
        phoneNumber: phoneNumber
      };
      
      sessionStorage.setItem('fvd_reset_data', JSON.stringify(resetData));
      
      // Try to send via Twilio first
      try {
        const message = `🔐 FV Drones Admin Password Reset

Your password reset code is: ${resetCode}

This code expires in 10 minutes.

If you didn't request this reset, please ignore this message.

- FV Drones Security Team`;
        
        const twilioResult = await TwilioSMS.sendSMS(phoneNumber, message);
        
        if (twilioResult.success) {
          console.log(`✅ Password reset code sent via SMS to ${phoneNumber}`);
          return { success: true };
        } else {
          console.warn('⚠️ Twilio SMS failed for password reset, using demo mode');
        }
      } catch (error) {
        console.warn('⚠️ Twilio error for password reset, using demo mode:', error);
      }
      
      // Fallback to demo mode
      alert(`Password Reset Code: ${resetCode}\n\n(This would normally be sent via SMS to ${phoneNumber})`);
      return { success: true };
      
    } catch (error) {
      return { success: false, error: 'Failed to send reset code' };
    }
  }

  // Verify reset code
  static verifyResetCode(inputCode: string): { success: boolean; error?: string } {
    try {
      const resetData = sessionStorage.getItem('fvd_reset_data');
      if (!resetData) {
        return { success: false, error: 'No reset code found. Please request a new reset.' };
      }

      const { code, expiresAt } = JSON.parse(resetData);
      
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem('fvd_reset_data');
        return { success: false, error: 'Reset code has expired. Please request a new reset.' };
      }

      if (inputCode === code) {
        // Don't remove reset data yet - need it for password change
        return { success: true };
      } else {
        return { success: false, error: 'Invalid reset code. Please try again.' };
      }
    } catch (error) {
      return { success: false, error: 'Reset code verification failed' };
    }
  }

  // Complete password reset
  static async completePasswordReset(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify we have valid reset session
      const resetData = sessionStorage.getItem('fvd_reset_data');
      if (!resetData) {
        return { success: false, error: 'Invalid reset session. Please start over.' };
      }

      const { expiresAt } = JSON.parse(resetData);
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem('fvd_reset_data');
        return { success: false, error: 'Reset session expired. Please start over.' };
      }

      // Validate new password
      const validation = this.validatePasswordStrength(newPassword);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join('. ') };
      }

      // Set new password
      const result = await this.setupPassword(newPassword);
      if (result.success) {
        // Clean up reset session
        sessionStorage.removeItem('fvd_reset_data');
        // Clear any existing admin session
        this.logout();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to reset password' };
    }
  }

  // Security headers and anti-scraping measures
  static initSecurityMeasures(): void {
    // Only apply security measures on admin pages
    if (!window.location.pathname.includes('/admin')) {
      return;
    }

    // Disable right-click context menu on admin pages
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        alert('Developer tools are disabled for security reasons.');
      }
    });

    // Detect developer tools
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          alert('Developer tools detected. For security reasons, please close them.');
          window.location.href = '/';
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Disable text selection on admin pages
    const style = document.createElement('style');
    style.textContent = `
      body.admin-page {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
      }
      
      body.admin-page * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      body.admin-page input, 
      body.admin-page textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
    `;
    document.head.appendChild(style);
  }

  // Rate limiting for admin actions
  private static rateLimitMap = new Map<string, number[]>();

  static checkRateLimit(action: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.rateLimitMap.has(action)) {
      this.rateLimitMap.set(action, []);
    }
    
    const requests = this.rateLimitMap.get(action)!;
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.rateLimitMap.set(action, validRequests);
    
    return true;
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    const token = this.generateSessionToken();
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  // Validate CSRF token
  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token;
  }
}