// Search Page JavaScript - Responsive Design System

class SearchPage {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 12;
        this.totalProperties = 0;
        this.isLoading = false;
        this.currentView = 'grid';
        this.searchTimeout = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialProperties();
        this.setupResponsiveFeatures();
    }

    bindEvents() {
        // Search input
        const mainSearch = document.getElementById('mainSearch');
        const mainSearchBtn = document.getElementById('mainSearchBtn');

        if (mainSearch) {
            mainSearch.addEventListener('input', (e) => this.handleSearchInput(e));
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        if (mainSearchBtn) {
            mainSearchBtn.addEventListener('click', () => this.performSearch());
        }

        // Filters
        const applyFilters = document.getElementById('applyFilters');
        const clearFilters = document.getElementById('clearFilters');
        const sortBy = document.getElementById('sortBy');

        if (applyFilters) {
            applyFilters.addEventListener('click', () => this.applyFilters());
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearFilters());
        }

        if (sortBy) {
            sortBy.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // View toggle
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');

        if (gridView) {
            gridView.addEventListener('click', () => this.setView('grid'));
        }

        if (listView) {
            listView.addEventListener('click', () => this.setView('list'));
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProperties());
        }

        // Reset search
        const resetSearch = document.getElementById('resetSearch');
        if (resetSearch) {
            resetSearch.addEventListener('click', () => this.resetSearch());
        }

        // Navbar toggle for mobile
        this.setupNavbarToggle();
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

        // Adjust grid columns based on screen size
        const propertiesContainer = document.querySelector('.properties-container');
        if (propertiesContainer) {
            if (width <= 480) {
                propertiesContainer.style.gridTemplateColumns = '1fr';
            } else if (width <= 768) {
                propertiesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
            } else {
                propertiesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
            }
        }
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const scrolled = window.pageYOffset > 50;
            navbar.classList.toggle('scrolled', scrolled);
        }
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();

        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            } else if (query.length === 0) {
                this.loadInitialProperties();
            }
        }, 300);
    }

    async performSearch(query = '') {
        if (this.isLoading) return;

        const searchQuery = query || document.getElementById('mainSearch')?.value || '';
        this.currentPage = 1;

        await this.loadProperties({
            search: searchQuery,
            page: this.currentPage,
            limit: this.pageSize
        });
    }

    async applyFilters() {
        if (this.isLoading) return;

        const filters = this.getFilterValues();
        this.currentPage = 1;

        await this.loadProperties({
            ...filters,
            page: this.currentPage,
            limit: this.pageSize
        });
    }

    getFilterValues() {
        const propertyType = document.getElementById('propertyType')?.value;
        const minPrice = document.getElementById('minPrice')?.value;
        const maxPrice = document.getElementById('maxPrice')?.value;
        const minSize = document.getElementById('minSize')?.value;
        const maxSize = document.getElementById('maxSize')?.value;

        const filters = {};

        if (propertyType && propertyType !== '') {
            filters.type = propertyType;
        }

        if (minPrice) {
            filters.minPrice = parseInt(minPrice);
        }

        if (maxPrice) {
            filters.maxPrice = parseInt(maxPrice);
        }

        if (minSize) {
            filters.minSize = parseInt(minSize);
        }

        if (maxSize) {
            filters.maxSize = parseInt(maxSize);
        }

        return filters;
    }

    clearFilters() {
        // Reset filter inputs
        const inputs = ['propertyType', 'minPrice', 'maxPrice', 'minSize', 'maxSize'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = '';
            }
        });

        this.loadInitialProperties();
    }

    async handleSort(sortBy) {
        if (this.isLoading) return;

        await this.loadProperties({
            sort: sortBy,
            page: 1,
            limit: this.pageSize
        });
    }

    setView(view) {
        this.currentView = view;

        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        const propertiesContainer = document.querySelector('.properties-container');

        if (gridView) gridView.classList.toggle('active', view === 'grid');
        if (listView) listView.classList.toggle('active', view === 'list');

        if (propertiesContainer) {
            propertiesContainer.classList.toggle('list-view', view === 'list');
        }
    }

    async loadInitialProperties() {
        await this.loadProperties({
            page: 1,
            limit: this.pageSize
        });
    }

    async loadMoreProperties() {
        if (this.isLoading) return;

        this.currentPage++;
        await this.loadProperties({
            page: this.currentPage,
            limit: this.pageSize,
            append: true
        });
    }

    async loadProperties(params = {}) {
        this.isLoading = true;
        this.showLoadingState();

        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${window.CONFIG?.API_BASE_URL || '/api'}/properties?${queryString}`);

            if (!response.ok) {
                throw new Error('Failed to load properties');
            }

            const data = await response.json();
            this.totalProperties = data.total || 0;

            if (params.append) {
                this.appendProperties(data.properties || []);
            } else {
                this.renderProperties(data.properties || []);
            }

            this.updateResultsInfo(data.properties?.length || 0);
            this.updateLoadMoreButton(data.properties?.length || 0);

        } catch (error) {
            console.error('Error loading properties:', error);
            this.showErrorState();
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const container = document.getElementById('propertiesContainer');
        if (!container) return;

        // Show loading skeletons
        const skeletonCount = this.currentView === 'grid' ? 6 : 3;
        const skeletons = Array.from({ length: skeletonCount }, () => this.createSkeletonCard()).join('');

        if (!document.querySelector('.property-skeleton')) {
            container.innerHTML = skeletons;
        }
    }

    hideLoadingState() {
        // Loading state is automatically hidden when properties are rendered
    }

    createSkeletonCard() {
        return `
            <div class="property-card property-skeleton">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-location"></div>
                    <div class="skeleton-price"></div>
                </div>
            </div>
        `;
    }

    renderProperties(properties) {
        const container = document.getElementById('propertiesContainer');
        if (!container) return;

        if (properties.length === 0) {
            this.showNoResults();
            return;
        }

        container.innerHTML = properties.map(property => this.createPropertyCard(property)).join('');
        this.hideNoResults();
    }

    appendProperties(properties) {
        const container = document.getElementById('propertiesContainer');
        if (!container) return;

        const fragment = document.createDocumentFragment();
        properties.forEach(property => {
            const card = document.createElement('div');
            card.innerHTML = this.createPropertyCard(property);
            fragment.appendChild(card.firstElementChild);
        });

        container.appendChild(fragment);
    }

    createPropertyCard(property) {
        const imageUrl = property.images?.[0] || '/images/property-placeholder.jpg';
        const price = property.price ? `₹${property.price.toLocaleString()}` : 'Price on request';
        const size = property.size ? `${property.size} sq ft` : 'Size not specified';

        return `
            <div class="property-card" data-property-id="${property._id}">
                <div class="property-image">
                    <img src="${imageUrl}" alt="${property.title}" loading="lazy">
                    <div class="property-badge">${property.type || 'Commercial'}</div>
                </div>
                <div class="property-content">
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.location || 'Location not specified'}</span>
                    </div>
                    <div class="property-details">
                        <div class="property-price">${price}</div>
                        <div class="property-size">${size}</div>
                    </div>
                    <div class="property-features">
                        ${this.getPropertyFeatures(property)}
                    </div>
                    <div class="property-actions">
                        <a href="property-details.html?id=${property._id}" class="btn btn-outline btn-sm">View Details</a>
                        <button class="btn btn-primary btn-sm" onclick="contactOwner('${property._id}')">Contact</button>
                    </div>
                </div>
            </div>
        `;
    }

    getPropertyFeatures(property) {
        const features = [];

        if (property.parking) features.push('<span class="property-feature"><i class="fas fa-parking"></i> Parking</span>');
        if (property.elevator) features.push('<span class="property-feature"><i class="fas fa-elevator"></i> Elevator</span>');
        if (property.ac) features.push('<span class="property-feature"><i class="fas fa-snowflake"></i> A/C</span>');
        if (property.security) features.push('<span class="property-feature"><i class="fas fa-shield-alt"></i> Security</span>');

        return features.slice(0, 3).join(''); // Limit to 3 features
    }

    updateResultsInfo(count) {
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsCount = document.getElementById('resultsCount');

        if (resultsTitle) {
            resultsTitle.textContent = count > 0 ? 'Search Results' : 'All Properties';
        }

        if (resultsCount) {
            if (this.totalProperties > 0) {
                const start = ((this.currentPage - 1) * this.pageSize) + 1;
                const end = Math.min(start + count - 1, this.totalProperties);
                resultsCount.textContent = `Showing ${start}-${end} of ${this.totalProperties} properties`;
            } else {
                resultsCount.textContent = 'Loading properties...';
            }
        }
    }

    updateLoadMoreButton(currentCount) {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        if (!loadMoreContainer || !loadMoreBtn) return;

        const hasMore = (this.currentPage * this.pageSize) < this.totalProperties;

        if (hasMore) {
            loadMoreContainer.style.display = 'flex';
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'Load More Properties';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    showNoResults() {
        const container = document.getElementById('propertiesContainer');
        const noResults = document.getElementById('noResults');

        if (container) container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) noResults.style.display = 'none';
    }

    showErrorState() {
        const container = document.getElementById('propertiesContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Unable to load properties</h3>
                    <p>Please try again later or contact support</p>
                    <button class="btn btn-primary" onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    resetSearch() {
        // Clear search input
        const mainSearch = document.getElementById('mainSearch');
        if (mainSearch) mainSearch.value = '';

        // Clear filters
        this.clearFilters();
    }
}

// Global functions for property actions
function contactOwner(propertyId) {
    // Implement contact functionality
    alert('Contact functionality will be implemented with the messaging system');
}

// Initialize search page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchPage = new SearchPage();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    if (window.searchPage) {
        window.searchPage.loadInitialProperties();
    }
});