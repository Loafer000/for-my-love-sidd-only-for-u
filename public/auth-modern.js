// Modern Auth JavaScript

let currentUserType = null;
let currentStep = 'userType'; // userType, login, signup

// Initialize auth page
document.addEventListener('DOMContentLoaded', function() {
    showUserTypeSelection();
    initializeFormValidation();
});

// User Type Selection
function selectUserType(type) {
    currentUserType = type;
    
    // Remove previous selections
    document.querySelectorAll('.user-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    event.currentTarget.classList.add('selected');
    
    // Auto advance to login after selection
    setTimeout(() => {
        showLogin();
    }, 800);
}

// Show different sections
function showUserTypeSelection() {
    hideAllSections();
    document.getElementById('userTypeSelection').style.display = 'block';
    currentStep = 'userType';
}

function showLogin() {
    hideAllSections();
    document.getElementById('loginForm').classList.add('active');
    currentStep = 'login';
    updateAuthHeader('login');
}

function showSignup() {
    hideAllSections();
    document.getElementById('signupForm').classList.add('active');
    currentStep = 'signup';
    updateAuthHeader('signup');
}

function hideAllSections() {
    document.getElementById('userTypeSelection').style.display = 'none';
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('successMessage').classList.remove('show');
}

function updateAuthHeader(type) {
    const headers = {
        login: {
            title: currentUserType === 'tenant' ? 'Find Your Perfect Space' : 'Manage Your Properties',
            subtitle: 'Sign in to your account to continue'
        },
        signup: {
            title: currentUserType === 'tenant' ? 'Start Your Search' : 'List Your Properties',
            subtitle: 'Create an account to get started'
        }
    };
    
    if (headers[type]) {
        const form = document.getElementById(type + 'Form');
        if (form) {
            const titleEl = form.querySelector('.auth-header h2');
            const subtitleEl = form.querySelector('.auth-header p');
            if (titleEl) titleEl.textContent = headers[type].title;
            if (subtitleEl) subtitleEl.textContent = headers[type].subtitle;
        }
    }
}

// Form Handling
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (validateLogin(email, password)) {
        showLoading(event.target);
        
        // Simulate API call
        setTimeout(() => {
            hideLoading(event.target);
            showSuccess();
            
            // Redirect after success
            setTimeout(() => {
                if (currentUserType === 'landlord') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'search.html';
                }
            }, 2000);
        }, 1500);
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        userType: currentUserType
    };
    
    if (validateSignup(formData)) {
        showLoading(event.target);
        
        // Simulate API call
        setTimeout(() => {
            hideLoading(event.target);
            showSuccess();
            
            // Redirect after success
            setTimeout(() => {
                if (currentUserType === 'landlord') {
                    window.location.href = 'list-property.html';
                } else {
                    window.location.href = 'search.html';
                }
            }, 2000);
        }, 2000);
    }
}

// Validation Functions
function validateLogin(email, password) {
    let isValid = true;
    
    // Email validation
    const emailInput = document.getElementById('loginEmail');
    const emailError = emailInput.nextElementSibling;
    if (!isValidEmail(email)) {
        showFieldError(emailInput, emailError);
        isValid = false;
    } else {
        hideFieldError(emailInput, emailError);
    }
    
    // Password validation
    const passwordInput = document.getElementById('loginPassword');
    const passwordError = passwordInput.nextElementSibling;
    if (password.length < 6) {
        showFieldError(passwordInput, passwordError);
        isValid = false;
    } else {
        hideFieldError(passwordInput, passwordError);
    }
    
    return isValid;
}

function validateSignup(data) {
    let isValid = true;
    
    // First name validation
    const firstNameInput = document.getElementById('firstName');
    const firstNameError = firstNameInput.nextElementSibling;
    if (!data.firstName.trim()) {
        showFieldError(firstNameInput, firstNameError);
        isValid = false;
    } else {
        hideFieldError(firstNameInput, firstNameError);
    }
    
    // Last name validation
    const lastNameInput = document.getElementById('lastName');
    const lastNameError = lastNameInput.nextElementSibling;
    if (!data.lastName.trim()) {
        showFieldError(lastNameInput, lastNameError);
        isValid = false;
    } else {
        hideFieldError(lastNameInput, lastNameError);
    }
    
    // Email validation
    const emailInput = document.getElementById('signupEmail');
    const emailError = emailInput.nextElementSibling;
    if (!isValidEmail(data.email)) {
        showFieldError(emailInput, emailError);
        isValid = false;
    } else {
        hideFieldError(emailInput, emailError);
    }
    
    // Phone validation
    const phoneInput = document.getElementById('phone');
    const phoneError = phoneInput.nextElementSibling;
    if (!isValidPhone(data.phone)) {
        showFieldError(phoneInput, phoneError);
        isValid = false;
    } else {
        hideFieldError(phoneInput, phoneError);
    }
    
    // Password validation
    const passwordInput = document.getElementById('signupPassword');
    const passwordError = passwordInput.nextElementSibling;
    if (data.password.length < 6) {
        showFieldError(passwordInput, passwordError);
        isValid = false;
    } else {
        hideFieldError(passwordInput, passwordError);
    }
    
    // Confirm password validation
    const confirmInput = document.getElementById('confirmPassword');
    const confirmError = confirmInput.nextElementSibling;
    if (data.password !== data.confirmPassword) {
        showFieldError(confirmInput, confirmError);
        isValid = false;
    } else {
        hideFieldError(confirmInput, confirmError);
    }
    
    // Terms validation
    const termsCheckbox = document.getElementById('agreeTerms');
    if (!termsCheckbox.checked) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }
    
    return isValid;
}

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFieldError(input, errorElement) {
    input.classList.add('error');
    errorElement.style.display = 'block';
}

function hideFieldError(input, errorElement) {
    input.classList.remove('error');
    errorElement.style.display = 'none';
}

function showLoading(form) {
    form.classList.add('loading');
    const submitBtn = form.querySelector('.auth-submit');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.dataset.originalText = originalText;
}

function hideLoading(form) {
    form.classList.remove('loading');
    const submitBtn = form.querySelector('.auth-submit');
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitBtn.dataset.originalText;
}

function showSuccess() {
    hideAllSections();
    document.getElementById('successMessage').classList.add('show');
}

// Form Enhancement
function initializeFormValidation() {
    // Real-time validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(input) {
    const errorElement = input.nextElementSibling;
    
    switch(input.type) {
        case 'email':
            if (isValidEmail(input.value)) {
                hideFieldError(input, errorElement);
            } else {
                showFieldError(input, errorElement);
            }
            break;
            
        case 'password':
            if (input.value.length >= 6) {
                hideFieldError(input, errorElement);
            } else {
                showFieldError(input, errorElement);
            }
            break;
            
        case 'tel':
            if (isValidPhone(input.value)) {
                hideFieldError(input, errorElement);
            } else {
                showFieldError(input, errorElement);
            }
            break;
            
        default:
            if (input.value.trim()) {
                hideFieldError(input, errorElement);
            } else {
                showFieldError(input, errorElement);
            }
    }
    
    // Special case for confirm password
    if (input.id === 'confirmPassword') {
        const password = document.getElementById('signupPassword').value;
        if (input.value === password) {
            hideFieldError(input, errorElement);
        } else {
            showFieldError(input, errorElement);
        }
    }
}

// Back to user type selection
function goBack() {
    showUserTypeSelection();
}

// Social Auth (placeholder)
document.addEventListener('click', function(e) {
    if (e.target.closest('.social-btn')) {
        e.preventDefault();
        alert('Social authentication will be implemented soon!');
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (currentStep !== 'userType') {
            showUserTypeSelection();
        }
    }
    
    if (e.key === 'Enter' && e.target.classList.contains('user-type-card')) {
        e.target.click();
    }
});

// Auto-focus on first input when forms appear
function focusFirstInput(formId) {
    setTimeout(() => {
        const form = document.getElementById(formId);
        const firstInput = form.querySelector('.form-input');
        if (firstInput) firstInput.focus();
    }, 300);
}

// Update show functions to include auto-focus
const originalShowLogin = showLogin;
showLogin = function() {
    originalShowLogin();
    focusFirstInput('loginForm');
};

const originalShowSignup = showSignup;
showSignup = function() {
    originalShowSignup();
    focusFirstInput('signupForm');
};