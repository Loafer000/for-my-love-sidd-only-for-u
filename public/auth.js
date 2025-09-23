// Auth Page JavaScript - Responsive Design System

class AuthPage {
    constructor() {
        this.currentStep = 'userType'; // userType, login, signup, success
        this.selectedUserType = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupResponsiveFeatures();
        this.showUserTypeSelection();
    }

    bindEvents() {
        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Navbar toggle for mobile
        this.setupNavbarToggle();

        // Password visibility toggle (if needed)
        this.setupPasswordToggles();
    }

    setupNavbarToggle() {
        const navToggle = document.getElementById('navToggle');
        const navMobile = document.getElementById('navMobile');

        if (navToggle && navMobile) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMobile.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMobile.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navMobile.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        }
    }

    setupPasswordToggles() {
        // Add password visibility toggles if needed
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            this.addPasswordToggle(input);
        });
    }

    addPasswordToggle(input) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');

        toggleBtn.addEventListener('click', () => {
            const isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            toggleBtn.innerHTML = isVisible ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        // Insert toggle button after input
        input.parentNode.insertBefore(toggleBtn, input.nextSibling);
    }

    setupResponsiveFeatures() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        this.handleResize(); // Initial check
    }

    handleResize() {
        const width = window.innerWidth;

        // Adjust layout based on screen size
        const authLayout = document.querySelector('.auth-layout');
        if (authLayout) {
            if (width <= 768) {
                // Mobile layout adjustments
                this.adjustMobileLayout();
            } else {
                // Desktop layout adjustments
                this.adjustDesktopLayout();
            }
        }
    }

    adjustMobileLayout() {
        // Mobile-specific adjustments
        const welcomeSection = document.querySelector('.auth-welcome');
        const formsSection = document.querySelector('.auth-forms-container');

        if (welcomeSection && formsSection) {
            // Ensure proper stacking on mobile
            welcomeSection.style.order = '1';
            formsSection.style.order = '2';
        }
    }

    adjustDesktopLayout() {
        // Desktop-specific adjustments
        const welcomeSection = document.querySelector('.auth-welcome');
        const formsSection = document.querySelector('.auth-forms-container');

        if (welcomeSection && formsSection) {
            welcomeSection.style.order = '';
            formsSection.style.order = '';
        }
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const scrolled = window.pageYOffset > 50;
            navbar.classList.toggle('scrolled', scrolled);
        }
    }

    showUserTypeSelection() {
        this.currentStep = 'userType';
        this.hideAllForms();
        const userTypeSection = document.getElementById('userTypeSelection');
        if (userTypeSection) {
            userTypeSection.style.display = 'block';
            this.animateIn(userTypeSection);
        }
    }

    showLogin() {
        this.currentStep = 'login';
        this.hideAllForms();
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.style.display = 'block';
            loginForm.classList.add('active');
            this.animateIn(loginForm);
            this.focusFirstInput(loginForm);
        }
    }

    showSignup() {
        this.currentStep = 'signup';
        this.hideAllForms();
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.style.display = 'block';
            signupForm.classList.add('active');
            this.animateIn(signupForm);
            this.focusFirstInput(signupForm);
        }
    }

    showSuccess() {
        this.currentStep = 'success';
        this.hideAllForms();
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            this.animateIn(successMessage);

            // Auto redirect after success
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);
        }
    }

    hideAllForms() {
        const forms = ['userTypeSelection', 'loginForm', 'signupForm', 'successMessage'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = 'none';
                form.classList.remove('active');
            }
        });
    }

    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    focusFirstInput(form) {
        const firstInput = form.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    selectUserType(type) {
        this.selectedUserType = type;

        // Update UI to show selection
        const cards = document.querySelectorAll('.user-type-card');
        cards.forEach(card => card.classList.remove('selected'));

        const selectedCard = document.querySelector(`[onclick="selectUserType('${type}')"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Auto proceed to login/signup after a short delay
        setTimeout(() => {
            this.showLogin();
        }, 500);
    }

    async handleLogin(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('.auth-submit');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const loginData = {
                email: formData.get('loginEmail'),
                password: formData.get('loginPassword'),
                rememberMe: formData.has('rememberMe')
            };

            // Validate form
            if (!this.validateLoginForm(loginData)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Make API call
            const response = await this.makeAuthRequest('/api/auth/login', loginData);

            if (response.success) {
                // Store auth token
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));

                // Show success and redirect
                this.showSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error(response.message || 'Login failed');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('.auth-submit');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const signupData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('signupEmail'),
                phone: formData.get('phone'),
                password: formData.get('signupPassword'),
                confirmPassword: formData.get('confirmPassword'),
                userType: this.selectedUserType,
                agreeTerms: formData.has('agreeTerms')
            };

            // Validate form
            if (!this.validateSignupForm(signupData)) {
                throw new Error('Please fill in all required fields correctly.');
            }

            // Make API call
            const response = await this.makeAuthRequest('/api/auth/register', signupData);

            if (response.success) {
                // Show success message
                this.showSuccess();
            } else {
                throw new Error(response.message || 'Registration failed');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateLoginForm(data) {
        if (!data.email || !data.password) {
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }

        return data.password.length >= 6;
    }

    validateSignupForm(data) {
        if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.password) {
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }

        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            return false;
        }

        // Password validation
        if (data.password.length < 6) {
            return false;
        }

        // Confirm password
        if (data.password !== data.confirmPassword) {
            return false;
        }

        // Terms agreement
        if (!data.agreeTerms) {
            return false;
        }

        return true;
    }

    async makeAuthRequest(endpoint, data) {
        const response = await fetch(`${window.CONFIG?.API_BASE_URL || '/api'}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

    showError(message) {
        // Create error toast
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    showSuccessMessage(message) {
        // Create success toast
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
}

// Global functions for form switching
function selectUserType(type) {
    if (window.authPage) {
        window.authPage.selectUserType(type);
    }
}

function showLogin() {
    if (window.authPage) {
        window.authPage.showLogin();
    }
}

function showSignup() {
    if (window.authPage) {
        window.authPage.showSignup();
    }
}

function handleLogin(event) {
    if (window.authPage) {
        window.authPage.handleLogin(event);
    }
}

function handleSignup(event) {
    if (window.authPage) {
        window.authPage.handleSignup(event);
    }
}

// Initialize auth page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authPage = new AuthPage();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    if (window.authPage) {
        window.authPage.showUserTypeSelection();
    }
});