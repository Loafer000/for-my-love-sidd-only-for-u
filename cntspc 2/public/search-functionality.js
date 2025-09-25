// Search Functionality - Keeps existing layout intact

const SEARCH_API_URL = 'http://localhost:3000/api';

// Load and display properties on search page
async function loadSearchResults() {
    const resultsContainer = document.getElementById('propertyResults');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!resultsContainer) return;
    
    try {
        // Get search criteria from localStorage or URL
        const searchCriteria = JSON.parse(localStorage.getItem('searchCriteria') || '{}');
        
        // Build query parameters
        const params = new URLSearchParams();
        if (searchCriteria.location) params.append('location', searchCriteria.location);
        if (searchCriteria.propertyType) params.append('type', searchCriteria.propertyType);
        if (searchCriteria.budget) params.append('maxPrice', searchCriteria.budget);
        
        console.log('🔍 Loading search results with params:', params.toString());
        
        const response = await fetch(`${SEARCH_API_URL}/properties/search?${params}`);
        const data = await response.json();
        
        console.log('📊 Search results:', data);
        
        // Update results count
        if (resultsCount) {
            resultsCount.textContent = `Found ${data.total} Properties`;
        }
        
        // Display properties
        displaySearchResults(data.properties);
        
    } catch (error) {
        console.error('❌ Search error:', error);
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="no-results">Unable to load properties. Please try again.</div>';
        }
    }
}

// Display search results in existing layout
function displaySearchResults(properties) {
    const container = document.getElementById('propertyResults');
    if (!container) return;
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No properties found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => `
        <div class="property-card">
            <div class="property-image">
                <div class="property-badge ${property.verified ? 'verified' : ''}">
                    ${property.verified ? '✓ Verified' : 'Pending'}
                </div>
                <i class="fas fa-building" style="font-size: 3rem; color: #667eea;"></i>
            </div>
            <div class="property-info">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </div>
                <div class="property-price">₹${property.rent.toLocaleString()}/month</div>
                <div class="property-details">
                    <div><strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</div>
                    <div><strong>Size:</strong> ${property.size} sq ft</div>
                </div>
                <div class="property-amenities">
                    <span class="amenity-badge"><i class="fas fa-car"></i> Parking</span>
                    <span class="amenity-badge"><i class="fas fa-wifi"></i> WiFi</span>
                    <span class="amenity-badge"><i class="fas fa-shield-alt"></i> Security</span>
                </div>
                <div class="property-actions">
                    <a href="property-details.html?id=${property.id}" class="btn-view-details">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                    <a href="property-details.html?id=${property.id}" class="btn-contact">
                        <i class="fas fa-phone"></i> Contact
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle search form submission (works with existing forms)
async function performSearch(event) {
    if (event) event.preventDefault();
    
    // Get search values from any search form
    const location = document.getElementById('searchLocation')?.value || 
                    document.getElementById('location')?.value || '';
    const type = document.getElementById('searchType')?.value || 
                document.getElementById('propertyType')?.value || '';
    const budget = document.getElementById('searchBudget')?.value || 
                  document.getElementById('budget')?.value || '';
    
    // Store search criteria
    const searchCriteria = { location, propertyType: type, budget };
    localStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
    
    console.log('🔍 Performing search:', searchCriteria);
    
    // If on search page, load results immediately
    if (window.location.pathname.includes('search.html')) {
        loadSearchResults();
    } else {
        // Redirect to search page
        window.location.href = 'search.html';
    }
}

// Apply filters from sidebar
function applyFilters() {
    const priceFilters = Array.from(document.querySelectorAll('.price-filters input:checked')).map(cb => cb.value);
    const sizeFilters = Array.from(document.querySelectorAll('.size-filters input:checked')).map(cb => cb.value);
    const amenityFilters = Array.from(document.querySelectorAll('.amenity-filters input:checked')).map(cb => cb.value);
    
    console.log('🎯 Applying filters:', { priceFilters, sizeFilters, amenityFilters });
    
    // Reload results with filters
    loadSearchResults();
}

// View property details
function viewPropertyDetails(propertyId) {
    console.log('👁️ Viewing property:', propertyId);
    window.location.href = `property-details.html?id=${propertyId}`;
}

// Contact landlord
function contactLandlord(propertyId) {
    console.log('📞 Contacting landlord for property:', propertyId);
    alert('Contact form will open here! Property ID: ' + propertyId);
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load results if on search page
    if (window.location.pathname.includes('search.html')) {
        loadSearchResults();
    }
    
    // Bind search forms
    const searchForms = document.querySelectorAll('.search-form-main, .search-form-ultra');
    searchForms.forEach(form => {
        form.addEventListener('submit', performSearch);
    });
    
    // Bind filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    console.log('🔍 Search functionality initialized');
});