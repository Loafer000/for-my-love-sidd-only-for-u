/* Universal Mobile JavaScript */
/* Ensures ALL interactive elements work properly on ALL devices */

class UniversalMobileHandler {
    constructor() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isMobile = window.innerWidth <= 768;
        this.mobileMenuOpen = false;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        console.log('🚀 Universal Mobile Handler initialized');
        console.log('📱 Touch device:', this.isTouch);
        console.log('📱 Mobile viewport:', this.isMobile);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Setup mobile menu handlers
        this.setupMobileMenu();
        
        // Setup universal button handlers
        this.setupButtonHandlers();
        
        // Setup form enhancements
        this.setupFormEnhancements();
        
        // Setup touch gestures
        this.setupTouchGestures();
        
        // Setup accessibility improvements
        this.setupAccessibility();
        
        // Initial setup
        this.handleResize();
    }

    setupMobileMenu() {
        // Find all possible mobile menu toggles
        const toggleSelectors = [
            '.nav-toggle',
            '.mobile-menu-toggle',
            '.hamburger',
            '.menu-toggle',
            '[data-toggle="mobile-menu"]'
        ];

        toggleSelectors.forEach(selector => {
            const toggles = document.querySelectorAll(selector);
            toggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMobileMenu();
                });
            });
        });

        // Find all possible mobile menus
        const menuSelectors = [
            '.nav-mobile',
            '.nav-mobile-menu',
            '.mobile-menu',
            '.mobile-nav',
            '[data-mobile-menu]'
        ];

        // Close menu when clicking on links
        menuSelectors.forEach(selector => {
            const menus = document.querySelectorAll(selector);
            menus.forEach(menu => {
                const links = menu.querySelectorAll('a, button');
                links.forEach(link => {
                    link.addEventListener('click', () => {
                        if (!link.hasAttribute('data-no-close')) {
                            this.closeMobileMenu();
                        }
                    });
                });
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen) {
                const isMenuClick = e.target.closest('.nav-mobile, .nav-mobile-menu, .nav-toggle, .mobile-menu');
                if (!isMenuClick) {
                    this.closeMobileMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        console.log('📱 Toggling mobile menu');
        
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        console.log('📱 Opening mobile menu');
        this.mobileMenuOpen = true;
        
        // Add classes to toggle and menus
        const toggles = document.querySelectorAll('.nav-toggle, .mobile-menu-toggle');
        const menus = document.querySelectorAll('.nav-mobile, .nav-mobile-menu, .mobile-menu');
        
        toggles.forEach(toggle => toggle.classList.add('active'));
        menus.forEach(menu => menu.classList.add('active'));
        
        // Prevent body scroll
        document.body.classList.add('mobile-menu-active');
        document.body.style.overflow = 'hidden';
        
        // Announce to screen readers
        this.announceToScreenReader('Menu opened');
    }

    closeMobileMenu() {
        console.log('📱 Closing mobile menu');
        this.mobileMenuOpen = false;
        
        // Remove classes from toggle and menus
        const toggles = document.querySelectorAll('.nav-toggle, .mobile-menu-toggle');
        const menus = document.querySelectorAll('.nav-mobile, .nav-mobile-menu, .mobile-menu');
        
        toggles.forEach(toggle => toggle.classList.remove('active'));
        menus.forEach(menu => menu.classList.remove('active'));
        
        // Restore body scroll
        document.body.classList.remove('mobile-menu-active');
        document.body.style.overflow = '';
        
        // Announce to screen readers
        this.announceToScreenReader('Menu closed');
    }

    setupButtonHandlers() {
        // Enhanced button interactions for touch devices
        if (this.isTouch) {
            const buttons = document.querySelectorAll('button, .btn, input[type="submit"], input[type="button"], .clickable');
            
            buttons.forEach(button => {
                // Add touch feedback
                button.addEventListener('touchstart', (e) => {
                    button.style.transform = 'scale(0.98)';
                    button.style.transition = 'transform 0.1s ease';
                });
                
                button.addEventListener('touchend', (e) => {
                    setTimeout(() => {
                        button.style.transform = '';
                        button.style.transition = '';
                    }, 100);
                });
                
                // Prevent double-tap zoom
                let lastTouchEnd = 0;
                button.addEventListener('touchend', (e) => {
                    const now = (new Date()).getTime();
                    if (now - lastTouchEnd <= 300) {
                        e.preventDefault();
                    }
                    lastTouchEnd = now;
                }, false);
            });
        }
    }

    setupFormEnhancements() {
        // Auto-zoom prevention on iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }

        // Enhanced form validation feedback
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    setupTouchGestures() {
        // Add swipe gestures for mobile
        let startX, startY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Detect swipe to close mobile menu
            if (this.mobileMenuOpen && diffX > 50 && Math.abs(diffY) < 100) {
                this.closeMobileMenu();
            }
        });
        
        document.addEventListener('touchend', () => {
            startX = null;
            startY = null;
        });
    }

    setupAccessibility() {
        // Improve focus management
        let focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        // Trap focus in mobile menu when open
        document.addEventListener('keydown', (e) => {
            if (this.mobileMenuOpen && e.key === 'Tab') {
                const menu = document.querySelector('.nav-mobile.active, .nav-mobile-menu.active');
                if (menu) {
                    const focusable = menu.querySelectorAll(focusableElements);
                    const firstFocusable = focusable[0];
                    const lastFocusable = focusable[focusable.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }

    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            console.log('📱 Viewport changed to:', this.isMobile ? 'mobile' : 'desktop');
            
            // Close mobile menu when switching to desktop
            if (!this.isMobile && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }
        
        // Adjust viewport height for mobile browsers
        if (this.isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        
        let isValid = true;
        let errorMessage = '';
        
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showFieldValidation(field, isValid, message) {
        this.clearFieldError(field);
        
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.color = '#EF4444';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '4px';
            field.parentNode.appendChild(errorElement);
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^\+?[\d\s\-\(\)]{10,}$/.test(phone);
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Utility method to check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Utility method to get safe viewport dimensions
    getViewportDimensions() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.universalMobileHandler = new UniversalMobileHandler();
    });
} else {
    window.universalMobileHandler = new UniversalMobileHandler();
}

// Add CSS for enhanced field validation
if (!document.querySelector('#universal-validation-styles')) {
    const style = document.createElement('style');
    style.id = 'universal-validation-styles';
    style.textContent = `
        .error {
            border-color: #EF4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .field-error {
            color: #EF4444;
            font-size: 14px;
            margin-top: 4px;
            display: block;
        }
        
        .sr-only {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }
    `;
    document.head.appendChild(style);
}