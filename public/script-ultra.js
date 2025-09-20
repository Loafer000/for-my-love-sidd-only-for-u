// Ultra Modern JavaScript with Super Animations

// Sample property data
let properties = [
    {
        id: 1,
        title: "Modern Office Space in Salt Lake",
        type: "office",
        location: "Salt Lake City, Kolkata",
        price: 45000,
        size: 1200,
        description: "Premium office space with modern amenities",
        verified: true,
        landlord: "Rajesh Kumar",
        phone: "+91 98765 43210",
        images: ["office1.jpg"]
    },
    {
        id: 2,
        title: "Retail Shop in Park Street",
        type: "retail",
        location: "Park Street, Kolkata",
        price: 35000,
        size: 800,
        description: "Prime retail location with high footfall",
        verified: true,
        landlord: "Priya Sharma",
        phone: "+91 98765 43211",
        images: ["retail1.jpg"]
    },
    {
        id: 3,
        title: "Industrial Warehouse in Howrah",
        type: "industrial",
        location: "Howrah, West Bengal",
        price: 25000,
        size: 2000,
        description: "Large warehouse space for industrial use",
        verified: true,
        landlord: "Amit Das",
        phone: "+91 98765 43212",
        images: ["warehouse1.jpg"]
    }
];

// Loading Screen Animation
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }
    }, 2000);
});

// Animated Counter for Stats
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 20);
}

// Initialize counters when in viewport
function initCounters() {
    const statCards = document.querySelectorAll('.stat-card-ultra');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const count = parseInt(card.dataset.count);
                const numberElement = card.querySelector('.stat-number');
                
                if (count === 24) {
                    animateCounter(numberElement, count, '/7');
                } else if (count === 95) {
                    animateCounter(numberElement, count, '%');
                } else {
                    animateCounter(numberElement, count, '+');
                }
                
                observer.unobserve(card);
            }
        });
    });
    
    statCards.forEach(card => observer.observe(card));
}

// Enhanced search functionality
function searchProperties(event) {
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

// Filter properties based on criteria
function filterProperties(criteria) {
    return properties.filter(property => {
        const matchesLocation = !criteria.location || 
            property.location.toLowerCase().includes(criteria.location.toLowerCase());
        const matchesType = !criteria.propertyType || 
            property.type === criteria.propertyType;
        const matchesBudget = !criteria.budget || 
            property.price <= parseInt(criteria.budget);
        
        return matchesLocation && matchesType && matchesBudget;
    });
}

// Enhanced Property Display with Animations
function displayProperties(propertiesToShow) {
    const container = document.getElementById('propertyResults');
    if (!container) return;
    
    if (propertiesToShow.length === 0) {
        container.innerHTML = '<div class="no-results animated"><i class="fas fa-search"></i><p>No properties found matching your criteria.</p></div>';
        return;
    }
    
    container.innerHTML = propertiesToShow.map((property, index) => `
        <div class="property-card-enhanced" style="animation-delay: ${index * 0.1}s">
            <div class="property-image-enhanced">
                <div class="property-badge">✓ Verified</div>
                <i class="fas fa-building" style="font-size: 3rem; color: #667eea;"></i>
            </div>
            <div class="property-info-enhanced">
                <h3 class="property-title-enhanced">${property.title}</h3>
                <div class="property-location-enhanced">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-price-enhanced">₹${property.price.toLocaleString()}/month</div>
                <div class="property-details-enhanced">
                    <div><strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</div>
                    <div><strong>Size:</strong> ${property.size} sq ft</div>
                </div>
                <div class="property-amenities">
                    <span class="amenity-badge"><i class="fas fa-car"></i> Parking</span>
                    <span class="amenity-badge"><i class="fas fa-wifi"></i> WiFi</span>
                    <span class="amenity-badge"><i class="fas fa-shield-alt"></i> Security</span>
                </div>
                <div class="property-actions">
                    <button class="btn-view-details" onclick="viewProperty(${property.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn-contact" onclick="contactLandlordBtn(${property.id})">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Animate cards on load
    const cards = container.querySelectorAll('.property-card-enhanced');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// View Property with Animation
function viewProperty(id) {
    if (event && event.target) {
        event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    }
    
    setTimeout(() => {
        window.location.href = `property-details.html?id=${id}`;
    }, 500);
}

// Contact Landlord with Animation
function contactLandlordBtn(id) {
    if (event && event.target) {
        event.target.style.animation = 'pulse 0.6s';
    }
    
    setTimeout(() => {
        alert('Contact form will open here!');
        if (event && event.target) {
            event.target.style.animation = '';
        }
    }, 300);
}

// Property listing form submission
function submitProperty(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const propertyData = {
        id: Date.now(),
        title: formData.get('propertyName'),
        type: formData.get('propertyType'),
        location: `${formData.get('address')}, ${formData.get('city')}`,
        price: parseInt(formData.get('rent')),
        size: parseInt(formData.get('size')),
        description: formData.get('description'),
        verified: false,
        landlord: formData.get('landlordName') || 'Property Owner',
        phone: formData.get('phone') || '+91 XXXXX XXXXX'
    };
    
    // Add to properties array
    properties.push(propertyData);
    
    // Show success animation
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Property Listed Successfully!';
    submitBtn.style.background = '#10b981';
    
    setTimeout(() => {
        alert('Property listed successfully! It will be verified within 24 hours.');
        event.target.reset();
        submitBtn.innerHTML = 'List Property';
        submitBtn.style.background = '';
    }, 2000);
}

// Contact landlord form
function contactLandlord(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const message = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        propertyId: new URLSearchParams(window.location.search).get('id')
    };
    
    // Show loading animation
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    setTimeout(() => {
        alert('Your message has been sent to the landlord. They will contact you soon!');
        event.target.reset();
        submitBtn.innerHTML = 'Send Message';
    }, 1500);
}

// Clear Filters with Animation
function clearFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        setTimeout(() => {
            checkbox.checked = false;
            if (checkbox.parentElement) {
                checkbox.parentElement.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    checkbox.parentElement.style.transform = 'scale(1)';
                }, 100);
            }
        }, index * 50);
    });
}

// Load More Properties with Animation
function loadMoreProperties() {
    const button = event.target;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading More...';
    
    setTimeout(() => {
        // Simulate loading more properties
        const newProperties = [
            {
                id: Date.now(),
                title: "Premium Office Space in New Town",
                type: "office",
                location: "New Town, Kolkata",
                price: 55000,
                size: 1500,
                verified: true
            }
        ];
        
        displayProperties(newProperties);
        button.innerHTML = '<i class="fas fa-redo"></i> Load More Properties';
    }, 1500);
}

// Enhanced budget functions
function updateBudgetDisplay(value) {
    const display = document.getElementById('budgetDisplay');
    if (display) {
        display.textContent = `₹${(value/1000).toFixed(0)}K`;
    }
}

function setBudget(value) {
    const slider = document.getElementById('budgetRange');
    if (slider) {
        slider.value = value;
        updateBudgetDisplay(value);
    }
}

function selectQuickLocation(location) {
    const input = document.getElementById('location');
    if (input) {
        input.value = location;
        input.focus();
    }
}

function toggleAdvancedFilters() {
    const filters = document.getElementById('advancedFilters');
    if (filters) {
        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    }
}

function applyRecommendation(type, location, budget) {
    // Set property type
    const typeRadio = document.querySelector(`input[name="propertyType"][value="${type}"]`);
    if (typeRadio) typeRadio.checked = true;
    
    // Set location
    const locationInput = document.getElementById('location');
    if (locationInput) locationInput.value = location;
    
    // Set budget
    setBudget(budget);
    
    // Trigger search
    const form = document.querySelector('.search-form-enhanced') || document.querySelector('.search-form-ultra');
    if (form) {
        const event = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
    }
}

// Initialize page based on current location
function initPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'search.html':
            initSearchPage();
            break;
        case 'property-details.html':
            initPropertyDetails();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
    }
}

function initSearchPage() {
    const criteria = JSON.parse(localStorage.getItem('searchCriteria') || '{}');
    const filteredProperties = filterProperties(criteria);
    displayProperties(filteredProperties);
    
    // Update search form with previous criteria
    if (criteria.location) {
        const locationInput = document.getElementById('searchLocation');
        if (locationInput) locationInput.value = criteria.location;
    }
    if (criteria.propertyType) {
        const typeSelect = document.getElementById('searchType');
        if (typeSelect) typeSelect.value = criteria.propertyType;
    }
    if (criteria.budget) {
        const budgetInput = document.getElementById('searchBudget');
        if (budgetInput) budgetInput.value = criteria.budget;
    }
}

function initPropertyDetails() {
    const propertyId = new URLSearchParams(window.location.search).get('id');
    const property = properties.find(p => p.id == propertyId);
    
    if (!property) {
        document.body.innerHTML = '<div class="container"><h2>Property not found</h2></div>';
        return;
    }
    
    // Update page content with property details
    const elements = {
        'propertyTitle': property.title,
        'propertyPrice': `₹${property.price.toLocaleString()}/month`,
        'propertyDescription': property.description,
        'propertySize': `${property.size} sq ft`,
        'propertyType': property.type.charAt(0).toUpperCase() + property.type.slice(1),
        'propertyLocation': property.location
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    if (property.verified) {
        const badge = document.getElementById('verifiedBadge');
        if (badge) badge.style.display = 'inline-block';
    }
}

function initDashboard() {
    const isLoggedIn = localStorage.getItem('landlordLoggedIn');
    if (!isLoggedIn) {
        showLoginForm();
        return;
    }
    
    displayDashboardStats();
}

function showLoginForm() {
    const content = document.getElementById('dashboardContent');
    if (content) {
        content.innerHTML = `
            <div class="form-container">
                <h2>Landlord Login</h2>
                <form onsubmit="login(event)">
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input type="password" name="password" required>
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
            </div>
        `;
    }
}

function login(event) {
    event.preventDefault();
    localStorage.setItem('landlordLoggedIn', 'true');
    location.reload();
}

function logout() {
    localStorage.removeItem('landlordLoggedIn');
    location.reload();
}

function displayDashboardStats() {
    const landlordProperties = properties.filter(p => p.landlord === 'Rajesh Kumar');
    
    const elements = {
        'totalListings': landlordProperties.length,
        'verifiedListings': landlordProperties.filter(p => p.verified).length,
        'totalInquiries': '12'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Location suggestions functionality
function initLocationSuggestions() {
    const locationInput = document.getElementById('location');
    const suggestionsDiv = document.getElementById('locationSuggestions');
    
    if (!locationInput || !suggestionsDiv) return;
    
    const indianCities = [
        'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana',
        'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
        'Jaipur, Rajasthan', 'Surat, Gujarat', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
        'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh',
        'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra', 'Patna, Bihar', 'Vadodara, Gujarat',
        'Ghaziabad, Uttar Pradesh', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra',
        'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat', 'Kalyan-Dombivali, Maharashtra',
        'Salt Lake City, Kolkata', 'Park Street, Kolkata', 'New Town, Kolkata', 'Howrah, West Bengal'
    ];
    
    locationInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }
        
        const matches = indianCities.filter(city => 
            city.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(city => 
                `<div class="suggestion-item" onclick="selectLocation('${city}')">${city}</div>`
            ).join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!locationInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
}

function selectLocation(city) {
    const locationInput = document.getElementById('location');
    const suggestionsDiv = document.getElementById('locationSuggestions');
    
    if (locationInput) locationInput.value = city;
    if (suggestionsDiv) suggestionsDiv.style.display = 'none';
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links-modern');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && toggle) {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initLocationSuggestions();
    initCounters();
    initPage();
    
    // Initialize budget display
    const budgetRange = document.getElementById('budgetRange');
    if (budgetRange) {
        updateBudgetDisplay(budgetRange.value);
    }
    
    // Add mobile menu event listener
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Add scroll animations
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
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.feature-card-ultra, .step-ultra');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});