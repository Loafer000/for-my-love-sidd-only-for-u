// Ultra Modern JavaScript with Super Animations

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Sample property data (fallback)
let properties = [];

// Loading Screen Animation
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        document.body.classList.add('loaded');
    }
});

// Property listing with file uploads
async function submitPropertyWithFiles(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Show loading animation
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/properties`, {
            method: 'POST',
            body: formData // Send FormData for file uploads
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Property and files uploaded:', result);
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Property & Files Uploaded!';
            submitBtn.style.background = '#10b981';
            
            setTimeout(() => {
                alert(`Property listed successfully! ${result.uploadedFiles || 0} files uploaded.`);
                event.target.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to upload property');
        }
    } catch (error) {
        console.error('❌ Upload error:', error);
        submitBtn.innerHTML = originalText;
        alert('Failed to upload property and files. Please try again.');
    }
}

// Enhanced search functionality with real API
async function searchProperties(event) {
    event.preventDefault();
    
    const location = document.getElementById('location').value;
    const propertyTypeSelect = document.querySelector('input[name="propertyType"]:checked') || document.getElementById('propertyType');
    const propertyType = propertyTypeSelect ? (propertyTypeSelect.value || propertyTypeSelect.value) : '';
    const budget = document.getElementById('budget') ? document.getElementById('budget').value : '';
    
    // Store search criteria in localStorage
    localStorage.setItem('searchCriteria', JSON.stringify({
        location,
        propertyType,
        budget
    }));
    
    // Add loading animation to search button
    const searchBtn = event.target.querySelector('button[type="submit"]') || event.target;
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    
    console.log('🔍 Starting search with:', { location, propertyType, budget });
    
    setTimeout(() => {
        searchBtn.innerHTML = originalText;
        window.location.href = 'search.html';
    }, 1000);
}

// Quick Search Function
function quickSearch(type, location, budget) {
    // Animate button click
    if (event && event.target) {
        event.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Set form values
    const locationInput = document.getElementById('location');
    const typeSelect = document.getElementById('propertyType');
    const budgetInput = document.getElementById('budget');
    
    if (locationInput) locationInput.value = location;
    if (typeSelect) typeSelect.value = type;
    if (budgetInput) budgetInput.value = budget;
    
    // Trigger search with animation
    setTimeout(() => {
        searchProperties({ preventDefault: () => {} });
    }, 300);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ConnectSpace loaded with file upload support');
});