// Enhanced Modern List Property JavaScript

class ListPropertyManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.uploadedImages = [];
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressIndicator();
        this.loadFormData();
        this.setupImageUpload();
        this.setupFormValidation();
        this.checkAuthentication();
    }

    // Authentication Check
    checkAuthentication() {
        const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
        const userMenu = document.querySelector('.user-menu');
        const loginButton = document.querySelector('.login-btn');
        
        if (!token) {
            // Redirect to login if not authenticated
            window.location.href = 'auth.html';
            return;
        }
        
        // Update navbar for authenticated user
        if (userMenu && loginButton) {
            loginButton.style.display = 'none';
            userMenu.style.display = 'flex';
        }
    }

    // Enhanced Event Listeners Setup
    setupEventListeners() {
        // Step navigation with enhanced mobile support
        const nextButtons = document.querySelectorAll('.btn-next');
        const prevButtons = document.querySelectorAll('.btn-prev');
        const submitButton = document.querySelector('.btn-submit');

        nextButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNextStep(btn);
            });
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePrevStep(btn);
            });
        });

        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit(submitButton);
            });
        }

        // Enhanced form inputs with real-time validation
        const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('change', this.saveFormData.bind(this));
            input.addEventListener('input', this.handleInputChange.bind(this));
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('focus', this.handleInputFocus.bind(this));
        });

        // Enhanced amenities checkboxes
        const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox input[type="checkbox"]');
        amenityCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', this.handleAmenityChange.bind(this));
        });

        // Terms checkbox
        const termsCheckbox = document.querySelector('#agreeTerms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', this.validateTerms.bind(this));
        }

        // Enhanced keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));

        // Enhanced mobile touch gestures
        this.setupTouchGestures();
        
        // Button ripple effects
        this.setupButtonEffects();
        
        // Form auto-save
        this.setupAutoSave();
    }

    // Touch Gestures for Mobile
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only process horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && this.currentStep < this.totalSteps) {
                    // Swipe left - next step
                    if (this.validateCurrentStep()) {
                        this.nextStep();
                    }
                } else if (diffX < 0 && this.currentStep > 1) {
                    // Swipe right - previous step
                    this.prevStep();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }

    // Enhanced Button Handling
    handleNextStep(button) {
        this.showButtonLoading(button);
        
        setTimeout(() => {
            console.log('Validating current step:', this.currentStep);
            const isValid = this.validateCurrentStep();
            console.log('Validation result:', isValid);
            
            if (isValid || window.location.search.includes('debug=true')) {
                console.log('Moving to next step');
                this.nextStep();
                this.hideButtonLoading(button);
            } else {
                console.log('Validation failed, showing errors');
                this.hideButtonLoading(button);
                this.showValidationErrors();
            }
        }, 300); // Small delay for better UX
    }
    
    handlePrevStep(button) {
        this.showButtonLoading(button);
        
        setTimeout(() => {
            this.prevStep();
            this.hideButtonLoading(button);
        }, 200);
    }
    
    handleSubmit(button) {
        this.showButtonLoading(button, 'Submitting...');
        this.submitForm();
    }
    
    showButtonLoading(button, text = 'Loading...') {
        if (!button) return;
        
        button.classList.add('btn-loading');
        button.disabled = true;
        button.setAttribute('data-original-text', button.innerHTML);
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    }
    
    hideButtonLoading(button) {
        if (!button) return;
        
        button.classList.remove('btn-loading');
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
        }
    }
    
    // Enhanced Input Handling
    handleInputChange(e) {
        const input = e.target;
        this.clearFieldError(input);
        this.saveFormData();
        
        // Real-time validation for certain fields
        if (input.type === 'email' || input.name === 'phone') {
            clearTimeout(this.validationTimeout);
            this.validationTimeout = setTimeout(() => {
                this.validateField(e);
            }, 500);
        }
    }
    
    handleInputFocus(e) {
        const input = e.target;
        this.clearFieldError(input);
        
        // Add focus animation
        input.parentElement?.classList.add('focused');
    }
    
    handleAmenityChange(e) {
        const checkbox = e.target;
        const amenityBox = checkbox.closest('.amenity-checkbox');
        
        // Visual feedback
        if (checkbox.checked) {
            amenityBox.style.transform = 'scale(0.95)';
            setTimeout(() => {
                amenityBox.style.transform = '';
            }, 150);
        }
        
        this.saveFormData();
    }
    
    // Button Effects Setup
    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', this.createRipple.bind(this));
            
            // Enhanced hover effects
            button.addEventListener('mouseenter', (e) => {
                if (!e.target.disabled) {
                    e.target.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', (e) => {
                if (!e.target.disabled) {
                    e.target.style.transform = '';
                }
            });
        });
    }
    
    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
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
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Auto-save Setup
    setupAutoSave() {
        let autoSaveTimeout;
        
        const autoSave = () => {
            this.saveFormData();
            this.showAutoSaveIndicator();
        };
        
        document.addEventListener('input', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                clearTimeout(autoSaveTimeout);
                autoSaveTimeout = setTimeout(autoSave, 1000);
            }
        });
    }
    
    showAutoSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = '✓ Auto-saved';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 9999;
            opacity: 0.9;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        field.parentElement?.classList.remove('error');
        const existingError = field.parentNode?.querySelector('.field-error, .form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Keyboard Navigation
    handleKeyNavigation(e) {
        if (e.ctrlKey) {
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.currentStep < this.totalSteps && this.validateCurrentStep()) {
                        this.nextStep();
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.currentStep > 1) {
                        this.prevStep();
                    }
                    break;
                case 'Enter':
                    if (this.currentStep === this.totalSteps) {
                        e.preventDefault();
                        this.submitForm();
                    }
                    break;
            }
        }
    }

    // Step Navigation
    nextStep() {
        console.log('nextStep called - current step:', this.currentStep, 'total steps:', this.totalSteps);
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            console.log('Moving to step:', this.currentStep);
            this.updateSteps();
            this.updateProgressIndicator();
            this.scrollToTop();
            this.announceStepChange();
        } else {
            console.log('Already at last step');
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateSteps();
            this.updateProgressIndicator();
            this.scrollToTop();
            this.announceStepChange();
        }
    }

    updateSteps() {
        const steps = document.querySelectorAll('.form-step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });
    }

    updateProgressIndicator() {
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressLines = document.querySelectorAll('.progress-line');
        
        progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.toggle('active', stepNumber === this.currentStep);
            step.classList.toggle('completed', stepNumber < this.currentStep);
        });
        
        progressLines.forEach((line, index) => {
            line.classList.toggle('completed', index + 1 < this.currentStep);
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    announceStepChange() {
        const stepTitles = [
            'Basic Property Details',
            'Property Features & Amenities',
            'Images & Media Upload',
            'Review & Submit'
        ];
        
        // Announce for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Step ${this.currentStep}: ${stepTitles[this.currentStep - 1]}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Form Validation
    validateCurrentStep() {
        const currentStepElement = document.querySelector('.form-step.active');
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });
        
        // Additional step-specific validation
        switch(this.currentStep) {
            case 1:
                isValid = this.validateBasicDetails() && isValid;
                break;
            case 2:
                isValid = this.validateFeatures() && isValid;
                break;
            case 3:
                isValid = this.validateImages() && isValid;
                break;
            case 4:
                isValid = this.validateTerms() && isValid;
                break;
        }
        
        if (!isValid) {
            this.showValidationErrors();
        }
        
        return isValid;
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.removeFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Specific field validations
        switch(fieldName) {
            case 'rent':
            case 'deposit':
                if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid amount';
                }
                break;
            case 'area':
                if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid area';
                }
                break;
            case 'phone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    validateBasicDetails() {
        const required = ['title', 'description', 'propertyType', 'rent'];
        return required.every(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            return field && field.value.trim() !== '';
        });
    }

    validateFeatures() {
        const bedrooms = document.querySelector('[name="bedrooms"]');
        const bathrooms = document.querySelector('[name="bathrooms"]');
        
        return bedrooms && bathrooms && 
               bedrooms.value !== '' && bathrooms.value !== '';
    }

    validateImages() {
        return this.uploadedImages.length > 0;
    }

    validateTerms() {
        const termsCheckbox = document.querySelector('#agreeTerms');
        return termsCheckbox && termsCheckbox.checked;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }

    removeFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    showValidationErrors() {
        this.showNotification('Please fill in all required fields correctly', 'error');
    }

    // Image Upload Functionality
    setupImageUpload() {
        const uploadArea = document.querySelector('.upload-area');
        const fileInput = document.querySelector('#propertyImages');
        
        if (!uploadArea || !fileInput) return;
        
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleImageSelection(e.target.files);
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleImageSelection(e.dataTransfer.files);
        });
    }

    handleImageSelection(files) {
        Array.from(files).forEach(file => {
            if (this.validateImageFile(file)) {
                this.addImagePreview(file);
            }
        });
    }

    validateImageFile(file) {
        if (!this.allowedTypes.includes(file.type)) {
            this.showNotification(`${file.name} is not a supported image format`, 'error');
            return false;
        }
        
        if (file.size > this.maxFileSize) {
            this.showNotification(`${file.name} is too large. Maximum size is 5MB`, 'error');
            return false;
        }
        
        if (this.uploadedImages.length >= 10) {
            this.showNotification('Maximum 10 images allowed', 'error');
            return false;
        }
        
        return true;
    }

    addImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                file: file,
                url: e.target.result,
                id: Date.now() + Math.random()
            };
            
            this.uploadedImages.push(imageData);
            this.renderImagePreview(imageData);
            this.updateImageCounter();
        };
        reader.readAsDataURL(file);
    }

    renderImagePreview(imageData) {
        const preview = document.querySelector('.upload-preview');
        if (!preview) return;
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.dataset.imageId = imageData.id;
        
        previewItem.innerHTML = `
            <img src="${imageData.url}" alt="Property image">
            <button type="button" class="preview-remove" onclick="listPropertyManager.removeImage(${imageData.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        preview.appendChild(previewItem);
    }

    removeImage(imageId) {
        this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
        
        const previewItem = document.querySelector(`[data-image-id="${imageId}"]`);
        if (previewItem) {
            previewItem.remove();
        }
        
        this.updateImageCounter();
    }

    updateImageCounter() {
        const counter = document.querySelector('.image-counter');
        if (counter) {
            counter.textContent = `${this.uploadedImages.length} / 10 images uploaded`;
        }
    }

    // Form Data Management
    saveFormData() {
        const formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        formInputs.forEach(input => {
            this.formData[input.name || input.id] = input.value;
        });
        
        // Save amenities
        this.formData.amenities = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.name === 'amenities') {
                this.formData.amenities.push(checkbox.value);
            }
        });
        
        // Save to localStorage for recovery
        localStorage.setItem('listPropertyFormData', JSON.stringify(this.formData));
    }

    loadFormData() {
        const savedData = localStorage.getItem('listPropertyFormData');
        if (savedData) {
            this.formData = JSON.parse(savedData);
            this.populateForm();
        }
    }

    populateForm() {
        Object.keys(this.formData).forEach(key => {
            if (key === 'amenities') return;
            
            const field = document.querySelector(`[name="${key}"], [id="${key}"]`);
            if (field) {
                field.value = this.formData[key];
            }
        });
        
        // Populate amenities
        if (this.formData.amenities) {
            this.formData.amenities.forEach(amenity => {
                const checkbox = document.querySelector(`input[value="${amenity}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }

    // Review Step Population
    populateReviewStep() {
        const reviewContent = document.querySelector('.review-content');
        if (!reviewContent) return;
        
        // Basic Details
        this.updateReviewValue('review-title', this.formData.title);
        this.updateReviewValue('review-type', this.formData.propertyType);
        this.updateReviewValue('review-rent', `$${this.formData.rent}`);
        this.updateReviewValue('review-deposit', `$${this.formData.deposit}`);
        this.updateReviewValue('review-area', `${this.formData.area} sq ft`);
        this.updateReviewValue('review-location', this.formData.location);
        
        // Features
        this.updateReviewValue('review-bedrooms', this.formData.bedrooms);
        this.updateReviewValue('review-bathrooms', this.formData.bathrooms);
        this.updateReviewValue('review-furnished', this.formData.furnished);
        
        // Amenities
        const amenitiesList = document.querySelector('.review-amenities');
        if (amenitiesList && this.formData.amenities) {
            amenitiesList.innerHTML = this.formData.amenities.join(', ') || 'None selected';
        }
        
        // Images count
        this.updateReviewValue('review-images', `${this.uploadedImages.length} images`);
    }

    updateReviewValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value || 'Not specified';
        }
    }

    // Form Submission
    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.showSubmittingState();
        
        try {
            // Prepare form data for submission
            const formData = new FormData();
            
            // Add text fields
            Object.keys(this.formData).forEach(key => {
                if (key !== 'amenities') {
                    formData.append(key, this.formData[key]);
                }
            });
            
            // Add amenities as JSON
            formData.append('amenities', JSON.stringify(this.formData.amenities || []));
            
            // Add images
            this.uploadedImages.forEach((imageData, index) => {
                formData.append('images', imageData.file);
            });
            
            // Get auth token
            const token = localStorage.getItem('token') || localStorage.getItem('jwt_token');
            
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showSuccessModal(result);
                this.clearFormData();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to submit property');
            }
        } catch (error) {
            console.error('Submission error:', error);
            this.showNotification(error.message || 'Failed to submit property. Please try again.', 'error');
        } finally {
            this.hideSubmittingState();
        }
    }

    showSubmittingState() {
        const submitButton = document.querySelector('.btn-submit');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }
    }

    hideSubmittingState() {
        const submitButton = document.querySelector('.btn-submit');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-check"></i> Submit Property';
        }
    }

    showSuccessModal(result) {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.add('show');
            
            // Update modal content with property ID
            const propertyId = result.property?.id || 'Unknown';
            const modalText = modal.querySelector('.success-modal p');
            if (modalText) {
                modalText.textContent = `Your property has been submitted successfully! Property ID: ${propertyId}`;
            }
        }
        
        // Auto-redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 5000);
    }

    clearFormData() {
        localStorage.removeItem('listPropertyFormData');
        this.formData = {};
        this.uploadedImages = [];
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#FEE2E2' : '#EBF8FF'};
            color: ${type === 'error' ? '#DC2626' : '#1E40AF'};
            border: 1px solid ${type === 'error' ? '#FCA5A5' : '#93C5FD'};
            border-radius: 0.5rem;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the list property manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.listPropertyManager = new ListPropertyManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);