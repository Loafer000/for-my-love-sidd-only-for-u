// Modern List Property - Enhanced Multi-Step Form
let currentStep = 1;
let uploadedImages = [];
let formData = {};

document.addEventListener('DOMContentLoaded', initializeForm);

function initializeForm() {
    // Initialize drag and drop
    initializeDragDrop();
    
    // Set minimum date to today
    const availableFromInput = document.querySelector('input[name="availableFrom"]');
    if (availableFromInput) {
        const today = new Date().toISOString().split('T')[0];
        availableFromInput.min = today;
        availableFromInput.value = today;
    }
    
    // Initialize form validation
    initializeFormValidation();
}

function initializeDragDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    if (!uploadArea || !imageInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });
    
    // Drag and drop events
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
        
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    });
    
    // File input change
    imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files);
    });
}

function handleFileUpload(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 5MB.`);
            return;
        }
        
        // Check if already uploaded
        if (uploadedImages.some(img => img.name === file.name && img.size === file.size)) {
            alert(`File ${file.name} is already uploaded.`);
            return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = {
                file: file,
                name: file.name,
                size: file.size,
                preview: e.target.result
            };
            
            uploadedImages.push(imageData);
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    });
}

function updateImagePreview() {
    const previewContainer = document.getElementById('uploadPreview');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = uploadedImages.map((image, index) => `
        <div class="preview-item">
            <img src="${image.preview}" alt="${image.name}" class="preview-image">
            <button type="button" class="preview-remove" onclick="removeImage(${index})" title="Remove image">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Update upload area text
    const uploadContent = document.querySelector('.upload-content h3');
    if (uploadContent) {
        if (uploadedImages.length > 0) {
            uploadContent.textContent = `${uploadedImages.length} image(s) uploaded. Add more or continue.`;
        } else {
            uploadContent.textContent = 'Drag & Drop Images Here';
        }
    }
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            saveStepData();
            currentStep++;
            showStep(currentStep);
            updateProgress();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Special handling for review step
    if (step === 4) {
        populateReviewContent();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
    
    // Update progress lines
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        const lineNumber = index + 1;
        line.classList.toggle('completed', lineNumber < currentStep);
    });
}

function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (!currentStepEl) return true;
    
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Special validation for step 3 (images)
    if (currentStep === 3) {
        if (uploadedImages.length < 3) {
            alert('Please upload at least 3 images of your property.');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error styling
    field.classList.remove('error');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required.';
        isValid = false;
    }
    
    // Type-specific validations
    if (value && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }
    
    if (value && field.type === 'number') {
        const num = parseFloat(value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        
        if (isNaN(num)) {
            errorMessage = 'Please enter a valid number.';
            isValid = false;
        } else if (!isNaN(min) && num < min) {
            errorMessage = `Value must be at least ${min}.`;
            isValid = false;
        } else if (!isNaN(max) && num > max) {
            errorMessage = `Value must not exceed ${max}.`;
            isValid = false;
        }
    }
    
    // Description minimum length
    if (field.name === 'description' && value && value.length < 50) {
        errorMessage = 'Description must be at least 50 characters.';
        isValid = false;
    }
    
    // Show error styling and message
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    } else {
        hideFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error message
    hideFieldError(field);
    
    // Create error message element
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.color = '#EF4444';
    errorEl.style.fontSize = '0.75rem';
    errorEl.style.marginTop = '4px';
    
    // Insert after the field
    field.parentNode.insertBefore(errorEl, field.nextSibling);
}

function hideFieldError(field) {
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
        errorEl.remove();
    }
}

function initializeFormValidation() {
    // Real-time validation
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
}

function saveStepData() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (!currentStepEl) return;
    
    // Save form data from current step
    const inputs = currentStepEl.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (input.name === 'amenities') {
                if (!formData.amenities) formData.amenities = [];
                if (input.checked && !formData.amenities.includes(input.value)) {
                    formData.amenities.push(input.value);
                } else if (!input.checked) {
                    formData.amenities = formData.amenities.filter(a => a !== input.value);
                }
            } else {
                formData[input.name] = input.checked;
            }
        } else {
            formData[input.name] = input.value;
        }
    });
    
    // Save images data
    if (currentStep === 3) {
        formData.images = uploadedImages;
    }
}

function populateReviewContent() {
    const reviewContainer = document.getElementById('reviewContent');
    if (!reviewContainer) return;
    
    // Collect all form data
    saveStepData();
    
    const amenityLabels = {
        'ac': 'Air Conditioning',
        'wifi': 'WiFi/Internet',
        'security': '24/7 Security',
        'elevator': 'Elevator',
        'cafeteria': 'Cafeteria',
        'conference': 'Conference Room',
        'power-backup': 'Power Backup',
        'washroom': 'Washroom'
    };
    
    reviewContainer.innerHTML = `
        <div class="review-section">
            <h3 class="review-title">
                <i class="fas fa-info-circle"></i>
                Basic Information
            </h3>
            <div class="review-grid">
                <div class="review-item">
                    <div class="review-label">Property Title</div>
                    <div class="review-value">${formData.title || 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Property Type</div>
                    <div class="review-value">${formData.type || 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Total Area</div>
                    <div class="review-value">${formData.size ? formData.size + ' sq ft' : 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Monthly Rent</div>
                    <div class="review-value">${formData.rent ? '₹' + parseInt(formData.rent).toLocaleString() : 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Security Deposit</div>
                    <div class="review-value">${formData.deposit ? '₹' + parseInt(formData.deposit).toLocaleString() : 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Available From</div>
                    <div class="review-value">${formData.availableFrom ? new Date(formData.availableFrom).toLocaleDateString() : 'Not specified'}</div>
                </div>
            </div>
        </div>
        
        <div class="review-section">
            <h3 class="review-title">
                <i class="fas fa-map-marker-alt"></i>
                Location Details
            </h3>
            <div class="review-grid">
                <div class="review-item">
                    <div class="review-label">City</div>
                    <div class="review-value">${formData.city || 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Area/Locality</div>
                    <div class="review-value">${formData.locality || 'Not specified'}</div>
                </div>
                <div class="review-item" style="grid-column: 1 / -1;">
                    <div class="review-label">Full Address</div>
                    <div class="review-value">${formData.address || 'Not specified'}</div>
                </div>
            </div>
        </div>
        
        <div class="review-section">
            <h3 class="review-title">
                <i class="fas fa-star"></i>
                Features & Amenities
            </h3>
            <div class="review-grid">
                <div class="review-item">
                    <div class="review-label">Floor Number</div>
                    <div class="review-value">${formData.floor || 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Furnishing Status</div>
                    <div class="review-value">${formData.furnishing || 'Not specified'}</div>
                </div>
                <div class="review-item">
                    <div class="review-label">Parking Spaces</div>
                    <div class="review-value">${formData.parking || '0'}</div>
                </div>
                <div class="review-item" style="grid-column: 1 / -1;">
                    <div class="review-label">Amenities</div>
                    <div class="review-value">
                        ${formData.amenities && formData.amenities.length > 0 
                            ? formData.amenities.map(a => amenityLabels[a] || a).join(', ')
                            : 'None selected'
                        }
                    </div>
                </div>
            </div>
        </div>
        
        <div class="review-section">
            <h3 class="review-title">
                <i class="fas fa-align-left"></i>
                Description
            </h3>
            <div class="review-value" style="line-height: 1.6; margin-top: 1rem;">
                ${formData.description || 'No description provided'}
            </div>
        </div>
        
        <div class="review-section">
            <h3 class="review-title">
                <i class="fas fa-camera"></i>
                Images (${uploadedImages.length})
            </h3>
            <div class="upload-preview">
                ${uploadedImages.map(image => `
                    <div class="preview-item">
                        <img src="${image.preview}" alt="${image.name}" class="preview-image">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Form submission
document.getElementById('listPropertyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    // Save final step data
    saveStepData();
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API submission
    setTimeout(() => {
        // In a real application, you would send the formData and uploadedImages to your backend
        console.log('Form Data:', formData);
        console.log('Uploaded Images:', uploadedImages);
        
        // Show success modal
        showSuccessModal();
        
        // Reset button (in case user wants to go back)
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
});

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function listAnother() {
    hideSuccessModal();
    
    // Reset form
    currentStep = 1;
    uploadedImages = [];
    formData = {};
    
    // Reset form fields
    document.getElementById('listPropertyForm').reset();
    
    // Set available date to today
    const availableFromInput = document.querySelector('input[name="availableFrom"]');
    if (availableFromInput) {
        const today = new Date().toISOString().split('T')[0];
        availableFromInput.value = today;
    }
    
    // Reset image preview
    updateImagePreview();
    
    // Show first step
    showStep(1);
    updateProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Progress step navigation
document.querySelectorAll('.progress-step').forEach((step, index) => {
    step.addEventListener('click', () => {
        const stepNumber = index + 1;
        if (stepNumber < currentStep) {
            currentStep = stepNumber;
            showStep(currentStep);
            updateProgress();
        }
    });
});

// Modal close functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        hideSuccessModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('successModal');
    if (modal && modal.classList.contains('active') && e.key === 'Escape') {
        hideSuccessModal();
    }
});

// Auto-save functionality (optional)
setInterval(() => {
    if (currentStep > 1) {
        saveStepData();
        localStorage.setItem('propertyFormData', JSON.stringify(formData));
    }
}, 30000); // Save every 30 seconds

// Load saved data on page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('propertyFormData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            formData = { ...formData, ...parsed };
            
            // Populate form fields with saved data
            Object.keys(formData).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = formData[key];
                    } else {
                        field.value = formData[key];
                    }
                }
            });
        } catch (e) {
            console.log('Error loading saved form data:', e);
        }
    }
});