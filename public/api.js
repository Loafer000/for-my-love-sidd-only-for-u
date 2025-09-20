// Frontend API integration
const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

// API functions
const api = {
    // Get all properties
    async getProperties(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE}/api/properties?${params}`);
        return response.json();
    },

    // Get single property
    async getProperty(id) {
        const response = await fetch(`${API_BASE}/api/properties/${id}`);
        return response.json();
    },

    // Create property
    async createProperty(formData) {
        const response = await fetch(`${API_BASE}/api/properties`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    },

    // Create inquiry
    async createInquiry(inquiryData) {
        const response = await fetch(`${API_BASE}/api/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiryData)
        });
        return response.json();
    },

    // Get property inquiries
    async getPropertyInquiries(propertyId) {
        const response = await fetch(`${API_BASE}/api/properties/${propertyId}/inquiries`);
        return response.json();
    }
};

// Update existing functions to use API
async function loadPropertiesFromAPI() {
    try {
        const apiProperties = await api.getProperties();
        // Merge with existing demo data
        return [...propertiesWithCoords, ...apiProperties];
    } catch (error) {
        console.log('Using demo data - API not available');
        return propertiesWithCoords;
    }
}

// Enhanced property submission
async function submitPropertyAPI(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        const result = await api.createProperty(formData);
        if (result.error) {
            alert('Error: ' + result.error);
        } else {
            alert('Property listed successfully! It will be verified within 24 hours.');
            event.target.reset();
        }
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to original function
        submitProperty(event);
    }
}

// Enhanced contact landlord
async function contactLandlordAPI(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const inquiryData = {
        propertyId: new URLSearchParams(window.location.search).get('id'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    try {
        const result = await api.createInquiry(inquiryData);
        if (result.error) {
            alert('Error: ' + result.error);
        } else {
            alert('Your message has been sent to the landlord. They will contact you soon!');
            event.target.reset();
        }
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to original function
        contactLandlord(event);
    }
}