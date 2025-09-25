// ConnectSpace - Mobile-First Responsive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMobile = document.getElementById('navMobile');

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMobile.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMobile.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        const navMobileLinks = navMobile.querySelectorAll('a');
        navMobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Search form handler
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const searchData = {
                location: this.querySelector('input[type="text"]')?.value || '',
                type: this.querySelector('select')?.value || '',
                budget: this.querySelector('input[type="number"]')?.value || ''
            };
            
            // Build search URL
            const params = new URLSearchParams();
            Object.keys(searchData).forEach(key => {
                if (searchData[key]) {
                    params.append(key, searchData[key]);
                }
            });
            
            // Redirect to search page with parameters
            window.location.href = `search.html${params.toString() ? '?' + params.toString() : ''}`;
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('button[type="submit"], .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading state to navigation links
            if (this.href && this.href.includes('#')) return;
            
            const originalText = this.innerHTML;
            const hasIcon = this.querySelector('i');
            
            if (this.type === 'submit' || this.classList.contains('search-btn')) {
                this.disabled = true;
                this.innerHTML = hasIcon ? 
                    '<i class="fas fa-spinner fa-spin"></i> Searching...' : 
                    'Loading...';
                
                // Reset after 3 seconds (for demo purposes)
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalText;
                }, 3000);
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and other elements for fade-in animations
    document.querySelectorAll('.feature-card, .stat, .hero-content, .hero-visual').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Counter animation for stats
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            let displayValue = Math.floor(current);
            if (target >= 1000) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            }
            if (element.textContent.includes('+')) {
                displayValue += '+';
            }
            
            element.textContent = displayValue;
        }, 20);
    };

    // Trigger counter animations when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && !numberElement.classList.contains('animated')) {
                    numberElement.classList.add('animated');
                    const text = numberElement.textContent;
                    const number = parseInt(text.replace(/[^0-9]/g, ''));
                    animateCounter(numberElement, number);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth >= 768) {
                navToggle?.classList.remove('active');
                navMobile?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 150);
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add focus management for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu with escape key
            if (navMobile?.classList.contains('active')) {
                navToggle?.classList.remove('active');
                navMobile?.classList.remove('active');
                document.body.style.overflow = '';
                navToggle?.focus();
            }
        }
    });

    // Add aria attributes dynamically
    if (navToggle) {
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        navToggle.setAttribute('aria-expanded', 'false');
        
        const originalToggleClick = navToggle.onclick;
        navToggle.addEventListener('click', function() {
            const isExpanded = navMobile?.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    console.log('ConnectSpace: Mobile-first responsive design loaded successfully!');
});

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    },

    // Get URL parameters
    getUrlParams: function() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }
};

// Make utils globally available
window.ConnectSpaceUtils = utils;