/* ===== ENHANCED SEARCH FUNCTIONALITY ===== */

// Search functionality variables
let currentFilters = {
    location: '',
    propertyTypes: [],
    priceMin: 0,
    priceMax: 50000,
    areaMin: null,
    areaMax: null,
    amenities: []
};

let currentSort = 'relevance';
let currentView = 'grid';
let searchResults = [];
let isLoading = false;

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    loadSampleProperties();
    setupEventListeners();
});

// ===== INITIALIZATION =====
function initializeSearch() {
    console.log('🔍 Enhanced Search Functionality Initialized');
    
    // Initialize price sliders
    initializePriceSliders();
    
    // Load initial properties
    performSearch();
}

function setupEventListeners() {
    // Main search
    const mainSearchBtn = document.getElementById('mainSearchBtn');
    const mainSearch = document.getElementById('mainSearch');
    
    if (mainSearchBtn) {
        mainSearchBtn.addEventListener('click', handleMainSearch);
    }
    
    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMainSearch();
            }
        });
        
        mainSearch.addEventListener('input', handleSearchInput);
    }
    
    // Quick filters
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            handleQuickFilter(this.dataset.filter);
        });
    });
    
    // Mobile filters toggle
    const mobileFiltersToggle = document.getElementById('mobileFiltersToggle');
    if (mobileFiltersToggle) {
        mobileFiltersToggle.addEventListener('click', toggleMobileFilters);
    }
    
    // Filter inputs
    setupFilterListeners();
    
    // View controls
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });
    
    // Sort control
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            handleSortChange(this.value);
        });
    }
    
    // Clear filters
    const clearAllFilters = document.getElementById('clearAllFilters');
    if (clearAllFilters) {
        clearAllFilters.addEventListener('click', clearAllFilters);
    }
    
    // Apply filters button
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', performSearch);
    }
}

function setupFilterListeners() {
    // Location filter
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.addEventListener('input', debounce(function() {
            currentFilters.location = this.value;
            updateActiveFiltersCount();
        }, 300));
    }
    
    // Property type checkboxes
    document.querySelectorAll('input[name="propertyType"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.propertyTypes.push(this.value);
            } else {
                currentFilters.propertyTypes = currentFilters.propertyTypes.filter(type => type !== this.value);
            }
            updateActiveFiltersCount();
        });
    });
    
    // Amenities checkboxes
    document.querySelectorAll('input[name="amenities"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                currentFilters.amenities.push(this.value);
            } else {
                currentFilters.amenities = currentFilters.amenities.filter(amenity => amenity !== this.value);
            }
            updateActiveFiltersCount();
        });
    });
    
    // Price inputs
    const priceMinInput = document.getElementById('priceMinInput');
    const priceMaxInput = document.getElementById('priceMaxInput');
    
    if (priceMinInput) {
        priceMinInput.addEventListener('change', function() {
            currentFilters.priceMin = parseInt(this.value) || 0;
            updateActiveFiltersCount();
        });
    }
    
    if (priceMaxInput) {
        priceMaxInput.addEventListener('change', function() {
            currentFilters.priceMax = parseInt(this.value) || 50000;
            updateActiveFiltersCount();
        });
    }
    
    // Area inputs
    const areaMin = document.getElementById('areaMin');
    const areaMax = document.getElementById('areaMax');
    
    if (areaMin) {
        areaMin.addEventListener('change', function() {
            currentFilters.areaMin = parseInt(this.value) || null;
            updateActiveFiltersCount();
        });
    }
    
    if (areaMax) {
        areaMax.addEventListener('change', function() {
            currentFilters.areaMax = parseInt(this.value) || null;
            updateActiveFiltersCount();
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
function handleMainSearch() {
    const searchInput = document.getElementById('mainSearch');
    if (searchInput) {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            currentFilters.location = searchTerm;
            performSearch();
        }
    }
}

function handleSearchInput() {
    const searchInput = document.getElementById('mainSearch');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm.length > 2) {
        showSearchSuggestions(searchTerm);
    } else {
        hideSearchSuggestions();
    }
}

function showSearchSuggestions(term) {
    const suggestions = [
        'Downtown Business District',
        'Tech Hub Area',
        'Financial District',
        'Shopping Mall Complex',
        'Industrial Zone',
        'Co-working Spaces'
    ].filter(suggestion => 
        suggestion.toLowerCase().includes(term.toLowerCase())
    );
    
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer && suggestions.length > 0) {
        suggestionsContainer.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');
        suggestionsContainer.style.display = 'block';
    }
}

function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('mainSearch');
    if (searchInput) {
        searchInput.value = suggestion;
        currentFilters.location = suggestion;
        hideSearchSuggestions();
        performSearch();
    }
}

function handleQuickFilter(filterType) {
    // Clear previous property type filters
    currentFilters.propertyTypes = [filterType];
    
    // Update UI
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Update checkboxes
    document.querySelectorAll('input[name="propertyType"]').forEach(checkbox => {
        checkbox.checked = checkbox.value === filterType;
    });
    
    updateActiveFiltersCount();
    performSearch();
}

async function performSearch() {
    showLoading();
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter properties based on current filters
        const filteredResults = filterProperties(searchResults);
        
        // Sort results
        const sortedResults = sortProperties(filteredResults);
        
        // Display results
        displayResults(sortedResults);
        updateResultsCount(sortedResults.length);
        updateActiveFilterTags();
        
    } catch (error) {
        console.error('Search error:', error);
        showNoResults();
    } finally {
        hideLoading();
    }
}

function filterProperties(properties) {
    return properties.filter(property => {
        // Location filter
        if (currentFilters.location && !property.location.toLowerCase().includes(currentFilters.location.toLowerCase()) 
            && !property.title.toLowerCase().includes(currentFilters.location.toLowerCase())) {
            return false;
        }
        
        // Property type filter
        if (currentFilters.propertyTypes.length > 0 && !currentFilters.propertyTypes.includes(property.type)) {
            return false;
        }
        
        // Price filter
        if (property.price < currentFilters.priceMin || property.price > currentFilters.priceMax) {
            return false;
        }
        
        // Area filter
        if (currentFilters.areaMin && property.area < currentFilters.areaMin) {
            return false;
        }
        
        if (currentFilters.areaMax && property.area > currentFilters.areaMax) {
            return false;
        }
        
        // Amenities filter
        if (currentFilters.amenities.length > 0) {
            const hasAllAmenities = currentFilters.amenities.every(amenity => 
                property.amenities.includes(amenity)
            );
            if (!hasAllAmenities) {
                return false;
            }
        }
        
        return true;
    });
}

function sortProperties(properties) {
    const sorted = [...properties];
    
    switch (currentSort) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'area-large':
            return sorted.sort((a, b) => b.area - a.area);
        case 'area-small':
            return sorted.sort((a, b) => a.area - b.area);
        case 'newest':
            return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        default:
            return sorted;
    }
}

// ===== UI UPDATES =====
function displayResults(properties) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (properties.length === 0) {
        showNoResults();
        return;
    }
    
    resultsContainer.innerHTML = properties.map(property => createPropertyCard(property)).join('');
    
    // Hide no results
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = 'none';
    }
}

function createPropertyCard(property) {
    return `
        <div class="property-card" onclick="viewProperty(${property.id})">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" loading="lazy">
                <div class="property-badges">
                    <span class="property-badge featured">Featured</span>
                    <span class="property-badge verified">Verified</span>
                </div>
                <button class="property-favorite" onclick="toggleFavorite(${property.id}, event)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="property-content">
                <div class="property-header">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-price">$${property.price.toLocaleString()}/mo</div>
                </div>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${property.location}</span>
                </div>
                <div class="property-features">
                    <div class="property-feature">
                        <i class="fas fa-expand-arrows-alt"></i>
                        <span>${property.area} sq ft</span>
                    </div>
                    <div class="property-feature">
                        <i class="fas fa-building"></i>
                        <span>${property.type}</span>
                    </div>
                    <div class="property-feature">
                        <i class="fas fa-star"></i>
                        <span>${property.rating}</span>
                    </div>
                </div>
                <div class="property-amenities">
                    ${property.amenities.slice(0, 3).map(amenity => 
                        `<span class="amenity-tag">${amenity}</span>`
                    ).join('')}
                    ${property.amenities.length > 3 ? `<span class="amenity-more">+${property.amenities.length - 3} more</span>` : ''}
                </div>
                <div class="property-actions">
                    <button class="btn btn-outline btn-sm" onclick="contactOwner(${property.id}, event)">
                        <i class="fas fa-phone"></i>
                        Contact
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="scheduleViewing(${property.id}, event)">
                        <i class="fas fa-calendar"></i>
                        Schedule Visit
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    const mobileResultsCount = document.getElementById('mobileResultsCount');
    
    const text = `Showing ${count} properties`;
    
    if (resultsCount) {
        resultsCount.textContent = text;
    }
    
    if (mobileResultsCount) {
        mobileResultsCount.textContent = text;
    }
}

function updateActiveFiltersCount() {
    let count = 0;
    
    if (currentFilters.location) count++;
    if (currentFilters.propertyTypes.length > 0) count++;
    if (currentFilters.priceMin > 0 || currentFilters.priceMax < 50000) count++;
    if (currentFilters.areaMin || currentFilters.areaMax) count++;
    if (currentFilters.amenities.length > 0) count++;
    
    const activeFiltersCount = document.getElementById('activeFiltersCount');
    if (activeFiltersCount) {
        activeFiltersCount.textContent = count;
        activeFiltersCount.classList.toggle('show', count > 0);
    }
}

function updateActiveFilterTags() {
    const activeFilters = document.getElementById('activeFilterTags');
    if (!activeFilters) return;
    
    const tags = [];
    
    if (currentFilters.location) {
        tags.push(`Location: ${currentFilters.location}`);
    }
    
    currentFilters.propertyTypes.forEach(type => {
        tags.push(`Type: ${type}`);
    });
    
    if (currentFilters.priceMin > 0 || currentFilters.priceMax < 50000) {
        tags.push(`Price: $${currentFilters.priceMin} - $${currentFilters.priceMax}`);
    }
    
    currentFilters.amenities.forEach(amenity => {
        tags.push(`Amenity: ${amenity}`);
    });
    
    activeFilters.innerHTML = tags.map(tag => 
        `<span class="filter-tag">${tag} <button onclick="removeFilterTag('${tag}')">×</button></span>`
    ).join('');
}

// ===== SAMPLE DATA =====
function loadSampleProperties() {
    searchResults = [
        {
            id: 1,
            title: 'Modern Office Space in Downtown',
            location: 'Downtown Business District',
            type: 'office',
            price: 3500,
            area: 1200,
            rating: 4.8,
            image: 'https://picsum.photos/400/300?random=1',
            amenities: ['parking', 'elevator', 'ac', 'wifi'],
            dateAdded: '2024-01-15'
        },
        {
            id: 2,
            title: 'Retail Store in Shopping Mall',
            location: 'Shopping Mall Complex',
            type: 'retail',
            price: 2800,
            area: 800,
            rating: 4.6,
            image: 'https://picsum.photos/400/300?random=2',
            amenities: ['parking', 'security', 'ac'],
            dateAdded: '2024-01-14'
        },
        {
            id: 3,
            title: 'Warehouse Space for Storage',
            location: 'Industrial Zone',
            type: 'warehouse',
            price: 1200,
            area: 5000,
            rating: 4.5,
            image: 'https://picsum.photos/400/300?random=3',
            amenities: ['security', 'parking'],
            dateAdded: '2024-01-13'
        },
        {
            id: 4,
            title: 'Co-working Space in Tech Hub',
            location: 'Tech Hub Area',
            type: 'coworking',
            price: 800,
            area: 400,
            rating: 4.9,
            image: 'https://picsum.photos/400/300?random=4',
            amenities: ['wifi', 'conference', 'ac', 'parking'],
            dateAdded: '2024-01-12'
        },
        {
            id: 5,
            title: 'Restaurant Space Available',
            location: 'Food District',
            type: 'restaurant',
            price: 4200,
            area: 1500,
            rating: 4.4,
            image: 'https://picsum.photos/400/300?random=5',
            amenities: ['parking', 'ac', 'security'],
            dateAdded: '2024-01-11'
        }
    ];
    
    // Add more sample properties
    for (let i = 6; i <= 20; i++) {
        const types = ['office', 'retail', 'warehouse', 'coworking', 'restaurant'];
        const locations = ['Downtown', 'Business District', 'Tech Hub', 'Shopping Area', 'Industrial Zone'];
        
        searchResults.push({
            id: i,
            title: `Commercial Property ${i}`,
            location: locations[Math.floor(Math.random() * locations.length)],
            type: types[Math.floor(Math.random() * types.length)],
            price: Math.floor(Math.random() * 4000) + 1000,
            area: Math.floor(Math.random() * 3000) + 500,
            rating: (Math.random() * 2 + 3).toFixed(1),
            image: `https://picsum.photos/400/300?random=${i}`,
            amenities: ['parking', 'ac', 'wifi', 'security'].slice(0, Math.floor(Math.random() * 4) + 1),
            dateAdded: `2024-01-${Math.floor(Math.random() * 10) + 1}`
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function showLoading() {
    const resultsLoading = document.getElementById('resultsLoading');
    const searchResults = document.getElementById('searchResults');
    
    if (resultsLoading) {
        resultsLoading.style.display = 'block';
    }
    
    if (searchResults) {
        searchResults.style.display = 'none';
    }
    
    isLoading = true;
}

function hideLoading() {
    const resultsLoading = document.getElementById('resultsLoading');
    const searchResults = document.getElementById('searchResults');
    
    if (resultsLoading) {
        resultsLoading.style.display = 'none';
    }
    
    if (searchResults) {
        searchResults.style.display = 'grid';
    }
    
    isLoading = false;
}

function showNoResults() {
    const noResults = document.getElementById('noResults');
    const searchResults = document.getElementById('searchResults');
    
    if (noResults) {
        noResults.style.display = 'block';
    }
    
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

function clearAllFilters() {
    currentFilters = {
        location: '',
        propertyTypes: [],
        priceMin: 0,
        priceMax: 50000,
        areaMin: null,
        areaMax: null,
        amenities: []
    };
    
    // Reset form inputs
    const locationFilter = document.getElementById('locationFilter');
    const mainSearch = document.getElementById('mainSearch');
    
    if (locationFilter) locationFilter.value = '';
    if (mainSearch) mainSearch.value = '';
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    const priceMinInput = document.getElementById('priceMinInput');
    const priceMaxInput = document.getElementById('priceMaxInput');
    const areaMin = document.getElementById('areaMin');
    const areaMax = document.getElementById('areaMax');
    
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';
    if (areaMin) areaMin.value = '';
    if (areaMax) areaMax.value = '';
    
    updateActiveFiltersCount();
    performSearch();
}

function initializePriceSliders() {
    // Initialize dual range sliders
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', function() {
            currentFilters.priceMin = parseInt(this.value);
            const priceMinInput = document.getElementById('priceMinInput');
            if (priceMinInput) priceMinInput.value = this.value;
        });
        
        priceMax.addEventListener('input', function() {
            currentFilters.priceMax = parseInt(this.value);
            const priceMaxInput = document.getElementById('priceMaxInput');
            if (priceMaxInput) priceMaxInput.value = this.value;
        });
    }
}

// ===== VIEW CONTROLS =====
function switchView(view) {
    currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
    
    const resultsContainer = document.getElementById('searchResults');
    if (resultsContainer) {
        resultsContainer.className = `properties-${view}`;
    }
    
    if (view === 'map') {
        showMapView();
    }
}

function handleSortChange(sortValue) {
    currentSort = sortValue;
    performSearch();
}

function toggleMobileFilters() {
    const searchFilters = document.getElementById('searchFilters');
    if (searchFilters) {
        searchFilters.classList.toggle('mobile-open');
    }
}

// ===== PROPERTY ACTIONS =====
function viewProperty(propertyId) {
    console.log('Viewing property:', propertyId);
    window.location.href = `property-details.html?id=${propertyId}`;
}

function toggleFavorite(propertyId, event) {
    event.stopPropagation();
    console.log('Toggling favorite for property:', propertyId);
    
    const favoriteBtn = event.target.closest('.property-favorite');
    favoriteBtn.classList.toggle('active');
    
    showNotification(
        favoriteBtn.classList.contains('active') ? 
        'Added to favorites' : 'Removed from favorites',
        'success'
    );
}

function contactOwner(propertyId, event) {
    event.stopPropagation();
    console.log('Contacting owner for property:', propertyId);
    showNotification('Contact information sent to your email', 'success');
}

function scheduleViewing(propertyId, event) {
    event.stopPropagation();
    console.log('Scheduling viewing for property:', propertyId);
    showNotification('Viewing scheduled successfully', 'success');
}

function showMapView() {
    console.log('Switching to map view');
    showNotification('Map view is being loaded...', 'info');
}

function debounce(func, wait) {
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

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
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