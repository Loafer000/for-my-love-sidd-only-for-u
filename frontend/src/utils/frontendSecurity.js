// Frontend Security Configuration and Protection
class FrontendSecurity {
  constructor() {
    this.init();
  }

  init() {
    // Initialize all security measures
    this.setupCSPProtection();
    this.setupXSSProtection();
    this.setupSecureStorage();
    this.setupRequestInterceptors();
    this.monitorSecurityEvents();
  }

  // Content Security Policy Protection
  setupCSPProtection() {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://js.stripe.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' " + (process.env.REACT_APP_API_URL || 'http://localhost:5000') + "; " +
      "frame-src 'self' https://js.stripe.com; " +
      "object-src 'none';"
    );
    document.head.appendChild(meta);
  }

  // XSS Protection
  setupXSSProtection() {
    // Sanitize any dynamic content
    window.sanitizeHTML = (html) => {
      const div = document.createElement('div');
      div.textContent = html;
      return div.innerHTML;
    };

    // Override innerHTML to add automatic sanitization
    const originalInnerHTML = Element.prototype.innerHTML;
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(value) {
        if (typeof value === 'string') {
          // Basic XSS prevention
          const sanitized = value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
          originalInnerHTML.call(this, sanitized);
        } else {
          originalInnerHTML.call(this, value);
        }
      },
      get: function() {
        return originalInnerHTML.call(this);
      }
    });
  }

  // Secure Storage Management
  setupSecureStorage() {
    const SecureStorage = {
      // Secure token storage
      setAuthToken: (token) => {
        if (!token) return;
        
        // Store with expiration
        const tokenData = {
          token: token,
          timestamp: Date.now(),
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('authToken', JSON.stringify(tokenData));
      },

      getAuthToken: () => {
        try {
          const tokenData = JSON.parse(localStorage.getItem('authToken'));
          if (!tokenData) return null;

          // Check expiration
          if (Date.now() > tokenData.expires) {
            localStorage.removeItem('authToken');
            return null;
          }

          return tokenData.token;
        } catch (error) {
          console.error('Error getting auth token:', error);
          return null;
        }
      },

      clearAuthToken: () => {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        // Clear any other auth-related data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      },

      // Secure user data storage
      setUserData: (userData) => {
        if (!userData) return;
        
        // Don't store sensitive information
        const safeUserData = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          userType: userData.userType,
          emailVerified: userData.emailVerified
        };
        
        localStorage.setItem('user', JSON.stringify(safeUserData));
      },

      getUserData: () => {
        try {
          const userData = localStorage.getItem('user');
          return userData ? JSON.parse(userData) : null;
        } catch (error) {
          console.error('Error getting user data:', error);
          return null;
        }
      }
    };

    // Expose secure storage globally
    window.SecureStorage = SecureStorage;
  }

  // Setup request interceptors for security
  setupRequestInterceptors() {
    // Intercept fetch requests to add security headers
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      // Add security headers
      options.headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      };

      // Add auth token if available
      const token = window.SecureStorage?.getAuthToken();
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

      // Add CSRF protection for state-changing requests
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase())) {
        options.headers['X-CSRF-Token'] = 'same-origin';
      }

      return originalFetch(url, options)
        .then(response => {
          // Handle token expiration
          if (response.status === 401) {
            const data = response.json();
            if (data?.code === 'TOKEN_EXPIRED') {
              window.SecureStorage?.clearAuthToken();
              window.location.href = '/login';
            }
          }
          return response;
        })
        .catch(error => {
          console.error('Request error:', error);
          throw error;
        });
    };
  }

  // Monitor security events
  monitorSecurityEvents() {
    // Detect suspicious activities
    let rapidClickCount = 0;
    let lastClickTime = 0;

    document.addEventListener('click', (event) => {
      const currentTime = Date.now();
      if (currentTime - lastClickTime < 100) { // Less than 100ms between clicks
        rapidClickCount++;
        if (rapidClickCount > 10) {
          console.warn('🚨 Suspicious rapid clicking detected');
          this.reportSecurityEvent('rapid_clicking', {
            timestamp: currentTime,
            target: event.target.tagName
          });
        }
      } else {
        rapidClickCount = 0;
      }
      lastClickTime = currentTime;
    });

    // Detect console usage (potential developer tools)
    let devtools = false;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200) {
        if (!devtools) {
          console.warn('🚨 Developer tools opened');
          devtools = true;
        }
      } else {
        devtools = false;
      }
    }, 1000);

    // Monitor storage changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken' && !event.newValue && event.oldValue) {
        console.warn('🚨 Auth token was removed from storage');
      }
    });

    // Monitor for potential XSS
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
              const src = node.getAttribute('src');
              if (src && !src.startsWith('https://js.stripe.com') && !src.startsWith('/')) {
                console.warn('🚨 Suspicious script detected:', src);
                node.remove();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Report security events
  reportSecurityEvent(type, details) {
    const event = {
      type,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send to security monitoring endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(error => {
        console.error('Failed to report security event:', error);
      });
    }

    console.warn('Security Event:', event);
  }

  // Validate input before sending to server
  validateInput(input, type = 'text') {
    if (typeof input !== 'string') {
      input = String(input);
    }

    // Check for common attack patterns
    const patterns = {
      sql: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b|'|;|--)/i,
      xss: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      path: /(\.\.\/)|(\.\.\\)/g
    };

    for (const [patternType, pattern] of Object.entries(patterns)) {
      if (pattern.test(input)) {
        this.reportSecurityEvent('malicious_input', {
          type: patternType,
          input: input.substring(0, 100) // Only log first 100 chars
        });
        return false;
      }
    }

    return true;
  }

  // Secure form submission
  secureSubmit(formData, url, options = {}) {
    // Validate all inputs
    for (const [key, value] of Object.entries(formData)) {
      if (!this.validateInput(value)) {
        throw new Error(`Invalid input detected in field: ${key}`);
      }
    }

    // Add security headers
    const secureOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(formData),
      ...options
    };

    return fetch(url, secureOptions);
  }
}

// Initialize security when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.FrontendSecurity = new FrontendSecurity();
  });
} else {
  window.FrontendSecurity = new FrontendSecurity();
}

export default FrontendSecurity;