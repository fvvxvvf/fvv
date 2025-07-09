// Simplified admin security system without Twilio
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
}

export class AdminSecurity {
  private static readonly STORAGE_KEY = 'fvd_admin_session';
  private static readonly PASSWORD_KEY = 'fvd_admin_password';
  private static readonly ATTEMPTS_KEY = 'fvd_admin_attempts';
  private static readonly CONFIG: SecurityConfig = {
    maxAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    passwordMinLength: 8
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
  static async verifyPassword(password: string): Promise<{ success: boolean; error?: string }> {
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
        
        // Create session
        this.createSession();
        return { success: true };
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
  }

  // Reset password functionality
  static resetPassword(): void {
    localStorage.removeItem(this.PASSWORD_KEY);
    localStorage.removeItem(this.ATTEMPTS_KEY);
    this.logout();
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