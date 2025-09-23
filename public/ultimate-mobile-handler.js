/**
 * ================================================================
 * ULTIMATE MOBILE HANDLER v2.0
 * Universal Mobile/Touch/Navigation Handler for ConnectSpace
 * Eliminates ALL mobile compatibility issues
 * ================================================================
 */

class UltimateMobileHandler {
    constructor() {
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.isMobile = window.innerWidth <= 768;
        this.mobileMenuOpen = false;
        this.lastTouchEnd = 0;
        this.scrollDirection = 'up';
        this.lastScrollY = 0;
        
        // Debounce functions
        this.debouncedResize = this.debounce(this.handleResize.bind(this), 150);
        this.debouncedScroll = this.debounce(this.handleScroll.bind(this), 16);
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAllFeatures());
        } else {
            this.setupAllFeatures();
        }
    }

    setupAllFeatures() {
        console.log('🚀 Initializing Ultimate Mobile Handler v2.0');
        
        // Core features
        this.setupMobileNavigation();
        this.setupTouchEnhancements();
        this.setupResponsiveImages();
        this.setupFormEnhancements();
        this.setupScrollBehavior();
        this.setupAccessibility();
        this.setupPWAFeatures();
        this.setupPerformanceOptimizations();
        
        // Event listeners
        this.attachEventListeners();
        
        // iOS/Android specific fixes
        this.applyDeviceSpecificFixes();
        
        console.log('✅ Ultimate Mobile Handler initialized successfully');
    }

    /* ===== MOBILE NAVIGATION ===== */
    setupMobileNavigation() {
        // Find all possible navigation toggles
        const toggleSelectors = [
            '.nav-toggle',
            '.mobile-menu-toggle',
            '.hamburger',
            '.menu-toggle',
            '[data-toggle="mobile-menu"]',
            '#navToggle'
        ];

        toggleSelectors.forEach(selector => {
            const toggles = document.querySelectorAll(selector);
            toggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleMobileMenu();
                });
                
                // Enhance for touch
                if (this.isTouch) {
                    this.enhanceButtonForTouch(toggle);
                }
            });
        });

        // Find all possible mobile menus
        const menuSelectors = [
            '.nav-mobile',
            '.nav-mobile-menu',
            '.mobile-menu',
            '.mobile-nav',
            '[data-mobile-menu]',
            '#navMobile'
        ];

        // Close menu when clicking on links
        menuSelectors.forEach(selector => {
            const menus = document.querySelectorAll(selector);
            menus.forEach(menu => {
                const links = menu.querySelectorAll('a, button');
                links.forEach(link => {
                    link.addEventListener('click', () => {
                        if (!link.matches('.nav-mobile-cta, .nav-cta')) {
                            this.closeMobileMenu();
                        }
                    });
                });
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.mobileMenuOpen && !this.isClickInsideMenu(e.target)) {
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
        
        // Find and activate toggles
        const toggles = document.querySelectorAll('.nav-toggle, .mobile-menu-toggle, #navToggle');
        toggles.forEach(toggle => toggle.classList.add('active'));
        
        // Find and activate menus
        const menus = document.querySelectorAll('.nav-mobile, .nav-mobile-menu, .mobile-menu, #navMobile');
        menus.forEach(menu => menu.classList.add('active'));
        
        // Prevent body scroll
        document.body.classList.add('mobile-menu-open');
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item for accessibility
        const firstMenuItem = document.querySelector('.nav-mobile.active .nav-mobile-link, .nav-mobile-menu.active a');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
        
        // Announce to screen readers
        this.announceToScreenReader('Navigation menu opened');
    }

    closeMobileMenu() {
        console.log('📱 Closing mobile menu');
        this.mobileMenuOpen = false;
        
        // Deactivate toggles
        const toggles = document.querySelectorAll('.nav-toggle, .mobile-menu-toggle, #navToggle');
        toggles.forEach(toggle => toggle.classList.remove('active'));
        
        // Deactivate menus
        const menus = document.querySelectorAll('.nav-mobile, .nav-mobile-menu, .mobile-menu, #navMobile');
        menus.forEach(menu => menu.classList.remove('active'));
        
        // Restore body scroll
        document.body.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        const toggle = document.querySelector('.nav-toggle, #navToggle');
        if (toggle) {
            toggle.focus();
        }
        
        // Announce to screen readers
        this.announceToScreenReader('Navigation menu closed');
    }

    isClickInsideMenu(target) {
        const menu = document.querySelector('.nav-mobile.active, .nav-mobile-menu.active');
        const toggle = document.querySelector('.nav-toggle, #navToggle');
        
        return (menu && menu.contains(target)) || (toggle && toggle.contains(target));
    }

    /* ===== TOUCH ENHANCEMENTS ===== */
    setupTouchEnhancements() {
        if (!this.isTouch) return;

        // Enhance all interactive elements
        const interactiveElements = document.querySelectorAll(`
            button, .btn, input[type="submit"], input[type="button"],
            a, .nav-link, .nav-mobile-link, .card, .property-card,
            .tab-button, .filter-button, .pagination-btn, .modal-btn,
            .dropdown-item, .menu-item, .action-btn, .clickable
        `);

        interactiveElements.forEach(element => {
            this.enhanceButtonForTouch(element);
        });

        // Add swipe gestures for mobile menu
        this.setupSwipeGestures();
        
        // Prevent double-tap zoom
        this.preventDoubleTabZoom();
    }

    enhanceButtonForTouch(element) {
        // Ensure minimum touch target size
        const rect = element.getBoundingClientRect();
        if (rect.height < 48 || rect.width < 48) {
            element.style.minHeight = '48px';
            element.style.minWidth = '48px';
            element.style.display = 'inline-flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
        }

        // Add touch feedback
        element.addEventListener('touchstart', (e) => {
            element.style.transform = 'scale(0.98)';
            element.style.transition = 'transform 0.1s ease';
            element.classList.add('touching');
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            setTimeout(() => {
                element.style.transform = '';
                element.style.transition = '';
                element.classList.remove('touching');
            }, 100);
        }, { passive: true });

        element.addEventListener('touchcancel', (e) => {
            element.style.transform = '';
            element.style.transition = '';
            element.classList.remove('touching');
        }, { passive: true });
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;

        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!e.touches[0]) return;
            
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            // Swipe right to open menu (from left edge)
            if (startX < 50 && distX > 100 && Math.abs(distY) < 100) {
                if (!this.mobileMenuOpen) {
                    this.openMobileMenu();
                }
            }
            
            // Swipe left to close menu
            if (this.mobileMenuOpen && distX < -100 && Math.abs(distY) < 100) {
                this.closeMobileMenu();
            }
        }, { passive: true });
    }

    preventDoubleTabZoom() {
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - this.lastTouchEnd <= 300) {
                e.preventDefault();
            }
            this.lastTouchEnd = now;
        }, false);
    }

    /* ===== RESPONSIVE IMAGES ===== */
    setupResponsiveImages() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }

        // Optimize image loading
        document.querySelectorAll('img').forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    /* ===== FORM ENHANCEMENTS ===== */
    setupFormEnhancements() {
        // Auto-resize textareas
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        });

        // Enhanced focus management
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
            });
        });

        // Prevent zoom on iOS when focusing inputs
        if (this.isIOS()) {
            document.querySelectorAll('input, select, textarea').forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.style.fontSize !== '16px') {
                        input.style.fontSize = '16px';
                    }
                });
            });
        }
    }

    /* ===== SCROLL BEHAVIOR ===== */
    setupScrollBehavior() {
        let ticking = false;

        const updateScrollDirection = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > this.lastScrollY) {
                this.scrollDirection = 'down';
            } else {
                this.scrollDirection = 'up';
            }
            
            this.lastScrollY = currentScrollY;
            
            // Update navbar on scroll
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Hide navbar on scroll down (mobile only)
                if (this.isMobile && this.scrollDirection === 'down' && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDirection);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ===== ACCESSIBILITY ENHANCEMENTS ===== */
    setupAccessibility() {
        // Improve focus management
        this.setupFocusTrap();
        this.setupSkipLinks();
        this.setupAriaLabels();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusTrap() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
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

    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-600);
            color: white;
            padding: 8px;
            border-radius: 4px;
            text-decoration: none;
            z-index: 1000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
            skipLink.classList.remove('sr-only');
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
            skipLink.classList.add('sr-only');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAriaLabels() {
        // Add ARIA labels to buttons without text
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (button.textContent.trim() === '') {
                const icon = button.querySelector('i');
                if (icon) {
                    const classes = icon.className;
                    if (classes.includes('fa-menu') || classes.includes('fa-bars')) {
                        button.setAttribute('aria-label', 'Toggle navigation menu');
                    } else if (classes.includes('fa-close') || classes.includes('fa-times')) {
                        button.setAttribute('aria-label', 'Close');
                    } else if (classes.includes('fa-search')) {
                        button.setAttribute('aria-label', 'Search');
                    }
                }
            }
        });
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /* ===== PWA FEATURES ===== */
    setupPWAFeatures() {
        // Add to home screen prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Handle app installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        // Create install button if it doesn't exist
        if (!document.querySelector('.install-prompt')) {
            const installButton = document.createElement('button');
            installButton.className = 'install-prompt btn btn-primary';
            installButton.textContent = 'Install App';
            installButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                border-radius: 50px;
                padding: 12px 24px;
            `;
            
            installButton.addEventListener('click', () => {
                if (this.deferredPrompt) {
                    this.deferredPrompt.prompt();
                    this.deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                        }
                        this.deferredPrompt = null;
                        this.hideInstallPrompt();
                    });
                }
            });
            
            document.body.appendChild(installButton);
        }
    }

    hideInstallPrompt() {
        const prompt = document.querySelector('.install-prompt');
        if (prompt) {
            prompt.remove();
        }
    }

    /* ===== PERFORMANCE OPTIMIZATIONS ===== */
    setupPerformanceOptimizations() {
        // Prefetch important pages
        this.prefetchImportantPages();
        
        // Optimize images
        this.optimizeImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    prefetchImportantPages() {
        const importantPages = ['search.html', 'about.html', 'contact.html'];
        
        importantPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
        
        // Convert images to WebP if supported
        if (this.supportsWebP()) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                img.src = img.dataset.webp;
            });
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', as: 'style' }
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() { this.rel = 'stylesheet'; };
            }
            document.head.appendChild(link);
        });
    }

    /* ===== EVENT LISTENERS ===== */
    attachEventListeners() {
        // Resize handler
        window.addEventListener('resize', this.debouncedResize, { passive: true });
        
        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });
        
        // Connection status
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    handleResize() {
        const wasWebView = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Close mobile menu if switching to desktop
        if (wasWebView && !this.isMobile && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update touch target sizes
        this.updateTouchTargets();
        
        // Update viewport height for mobile browsers
        this.updateViewportHeight();
    }

    handleOrientationChange() {
        // Close mobile menu on orientation change
        if (this.mobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update viewport dimensions
        this.updateViewportHeight();
        
        // Refresh layout
        this.refreshLayout();
    }

    handlePageHidden() {
        // Pause unnecessary operations
        this.pauseAnimations();
    }

    handlePageVisible() {
        // Resume operations
        this.resumeAnimations();
    }

    handleOnline() {
        console.log('📡 Connection restored');
        this.showConnectionStatus('online');
    }

    handleOffline() {
        console.log('📡 Connection lost');
        this.showConnectionStatus('offline');
    }

    /* ===== DEVICE SPECIFIC FIXES ===== */
    applyDeviceSpecificFixes() {
        if (this.isIOS()) {
            this.applyIOSFixes();
        }
        
        if (this.isAndroid()) {
            this.applyAndroidFixes();
        }
        
        if (this.isSamsung()) {
            this.applySamsungFixes();
        }
    }

    applyIOSFixes() {
        // Fix iOS Safari viewport issues
        const setIOSViewportHeight = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        
        setIOSViewportHeight();
        window.addEventListener('resize', setIOSViewportHeight);
        
        // Fix iOS double-tap zoom
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
        
        // Fix iOS keyboard issues
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.body.scrollTop = 0;
                }, 0);
            });
        });
    }

    applyAndroidFixes() {
        // Fix Android Chrome viewport issues
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Fix Android keyboard resize issues
        let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        
        const handleViewportChange = () => {
            const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
            } else {
                document.body.classList.remove('keyboard-open');
            }
        };
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
        } else {
            window.addEventListener('resize', handleViewportChange);
        }
    }

    applySamsungFixes() {
        // Fix Samsung Internet browser issues
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('samsungbrowser')) {
            // Samsung-specific fixes
            document.body.classList.add('samsung-browser');
            
            // Fix touch delay
            document.addEventListener('touchstart', function() {}, { passive: true });
        }
    }

    /* ===== UTILITY FUNCTIONS ===== */
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    isSamsung() {
        return /Samsung/.test(navigator.userAgent);
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    updateTouchTargets() {
        if (!this.isTouch) return;
        
        document.querySelectorAll('button, .btn, a, input').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height < 48) {
                element.style.minHeight = '48px';
            }
        });
    }

    updateViewportHeight() {
        // Update CSS custom property for mobile viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    refreshLayout() {
        // Force layout recalculation
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }

    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }

    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }

    showConnectionStatus(status) {
        const existingStatus = document.querySelector('.connection-status');
        if (existingStatus) {
            existingStatus.remove();
        }
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `connection-status ${status}`;
        statusDiv.textContent = status === 'online' ? 'Connection restored' : 'No internet connection';
        statusDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${status === 'online' ? '#22c55e' : '#ef4444'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.remove();
        }, 3000);
    }

    handleScroll() {
        // Implement any scroll-related functionality
        this.debouncedScroll();
    }

    /* ===== PUBLIC API ===== */
    // Public methods that can be called from outside
    toggleMenu() {
        this.toggleMobileMenu();
    }

    closeMenu() {
        this.closeMobileMenu();
    }

    openMenu() {
        this.openMobileMenu();
    }

    refresh() {
        this.setupAllFeatures();
    }
}

/* ===== CSS FOR MOBILE ENHANCEMENTS ===== */
const mobileEnhancementStyles = `
<style>
.touching {
    background-color: rgba(59, 130, 246, 0.1) !important;
}

.keyboard-navigation button:focus,
.keyboard-navigation a:focus,
.keyboard-navigation input:focus,
.keyboard-navigation select:focus,
.keyboard-navigation textarea:focus {
    outline: 2px solid var(--primary-500) !important;
    outline-offset: 2px !important;
}

.animations-paused *,
.animations-paused *::before,
.animations-paused *::after {
    animation-play-state: paused !important;
    transition: none !important;
}

.keyboard-open {
    padding-bottom: 0 !important;
}

.samsung-browser .nav-mobile {
    transform: translate3d(0, 0, 0);
}

.connection-status {
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
    .navbar {
        padding-bottom: env(safe-area-inset-bottom);
    }
    
    body {
        padding-bottom: env(safe-area-inset-bottom);
    }
}

/* Android specific fixes */
.keyboard-open .navbar {
    position: absolute !important;
}

/* Ensure minimum touch targets */
@media (max-width: 768px) {
    button,
    .btn,
    a,
    input[type="submit"],
    input[type="button"],
    .nav-link,
    .nav-mobile-link {
        min-height: 48px !important;
        min-width: 48px !important;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', mobileEnhancementStyles);

/* ===== AUTO-INITIALIZATION ===== */
// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ultimateMobileHandler = new UltimateMobileHandler();
    });
} else {
    window.ultimateMobileHandler = new UltimateMobileHandler();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltimateMobileHandler;
}