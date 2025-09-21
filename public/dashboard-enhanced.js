// Enhanced Modern Dashboard - Mobile-First User Experience
const API_BASE = CONFIG?.API_BASE || 'http://localhost:3000/api';

// State management
let dashboardState = {
    user: null,
    properties: [],
    inquiries: [],
    stats: {},
    loading: false
};

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);

async function initializeDashboard() {
    try {
        // Show loading state
        setLoadingState(true);
        
        // Check authentication
        if (!checkAuth()) return;
        
        // Initialize UI components
        initializeUserMenu();
        initializeMobileMenu();
        
        // Load data
        await Promise.all([
            loadUserData(),
            loadStats(),
            loadProperties(),
            loadInquiries()
        ]);
        
        // Initialize interactive elements
        initializeInteractiveElements();
        
        console.log('✅ Dashboard initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    } finally {
        setLoadingState(false);
    }
}

function checkAuth() {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const userType = localStorage.getItem('userType');
    
    if (!userLoggedIn) {
        window.location.href = 'auth.html';
        return false;
    }
    
    // Store user info in state
    dashboardState.user = {
        type: userType,
        name: localStorage.getItem('userName') || (userType === 'landlord' ? 'Landlord' : 'Tenant'),
        email: localStorage.getItem('userEmail') || 'user@example.com'
    };
    
    // Update UI with user info
    updateUserInfo();
    
    return true;
}

function updateUserInfo() {
    const userName = document.getElementById('userName');
    if (userName && dashboardState.user) {
        userName.textContent = dashboardState.user.name;
    }
}

function initializeUserMenu() {
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenuToggle && userDropdown) {
        // Toggle dropdown on click
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
}

function initializeMobileMenu() {
    // Mobile menu functionality is handled by modern-navbar.js
    // This function can be extended for dashboard-specific mobile interactions
    
    // Add touch-friendly interactions for mobile
    if (window.innerWidth <= 768) {
        addMobileTouchInteractions();
    }
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            adjustForOrientation();
        }, 100);
    });
}

function addMobileTouchInteractions() {
    // Add touch feedback for cards
    const cards = document.querySelectorAll('.stat-card, .action-card, .property-card, .inquiry-item');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

function adjustForOrientation() {
    // Adjust layout for orientation changes
    const viewport = window.visualViewport || { width: window.innerWidth, height: window.innerHeight };
    
    if (viewport.width < viewport.height) {
        // Portrait mode
        document.body.classList.add('portrait-mode');
        document.body.classList.remove('landscape-mode');
    } else {
        // Landscape mode
        document.body.classList.add('landscape-mode');
        document.body.classList.remove('portrait-mode');
    }
}

async function loadUserData() {
    // Simulate API call - replace with real API
    return new Promise((resolve) => {
        setTimeout(() => {
            // Demo user data
            resolve();
        }, 300);
    });
}

async function loadStats() {
    try {
        // Simulate API call - replace with real API
        const stats = await simulateApiCall({
            totalProperties: 5,
            verifiedProperties: 4,
            totalInquiries: 12,
            monthlyRevenue: '₹2.4L',
            revenueGrowth: '+12%'
        });
        
        dashboardState.stats = stats;
        updateStatsDisplay();
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function updateStatsDisplay() {
    const stats = dashboardState.stats;
    
    updateElement('totalListings', stats.totalProperties);
    updateElement('verifiedListings', stats.verifiedProperties);
    updateElement('totalInquiries', stats.totalInquiries);
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined) {
        // Add loading animation
        element.style.opacity = '0.5';
        setTimeout(() => {
            element.textContent = value;
            element.style.opacity = '1';
        }, 200);
    }
}

async function loadProperties() {
    try {
        // Simulate API call - replace with real API
        const properties = await simulateApiCall([
            {
                id: 1,
                title: 'Modern Office Space in Salt Lake',
                price: '₹45,000/month',
                type: 'Office',
                area: '1200 sq ft',
                views: 45,
                status: 'verified',
                image: 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Office+Space',
                inquiries: 3
            },
            {
                id: 2,
                title: 'Retail Space in New Market',
                price: '₹30,000/month',
                type: 'Retail',
                area: '800 sq ft',
                views: 28,
                status: 'pending',
                image: 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Retail+Space',
                inquiries: 1
            }
        ]);
        
        dashboardState.properties = properties;
        updatePropertiesDisplay();
        
    } catch (error) {
        console.error('Error loading properties:', error);
        showEmptyState('properties');
    }
}

function updatePropertiesDisplay() {
    const propertiesList = document.getElementById('propertiesList');
    const emptyProperties = document.getElementById('emptyProperties');
    
    if (!propertiesList) return;
    
    if (dashboardState.properties.length === 0) {
        showEmptyState('properties');
        return;
    }
    
    // Hide empty state
    if (emptyProperties) emptyProperties.style.display = 'none';
    
    // Clear existing content
    propertiesList.innerHTML = '';
    
    // Add properties
    dashboardState.properties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesList.appendChild(propertyCard);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
        <div class="property-image">
            <img src="${property.image}" alt="${property.title}" loading="lazy">
            <div class="property-status ${property.status}">
                <i class="fas fa-${property.status === 'verified' ? 'check-circle' : 'clock'}"></i>
                ${property.status === 'verified' ? 'Verified' : 'Pending'}
            </div>
        </div>
        <div class="property-details">
            <h3 class="property-title">${property.title}</h3>
            <div class="property-price">${property.price}</div>
            <div class="property-meta">
                <span class="meta-item">
                    <i class="fas fa-home"></i>
                    ${property.type}
                </span>
                <span class="meta-item">
                    <i class="fas fa-ruler-combined"></i>
                    ${property.area}
                </span>
                <span class="meta-item">
                    <i class="fas fa-eye"></i>
                    ${property.views} views
                </span>
            </div>
            <div class="property-actions">
                <button class="btn btn-sm btn-primary" onclick="editProperty(${property.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewInquiries(${property.id})">
                    <i class="fas fa-envelope"></i>
                    Inquiries (${property.inquiries})
                </button>
                <button class="btn btn-sm btn-outline" onclick="viewAnalytics(${property.id})">
                    <i class="fas fa-chart-line"></i>
                    Analytics
                </button>
            </div>
        </div>
    `;
    
    return card;
}

async function loadInquiries() {
    try {
        // Simulate API call - replace with real API
        const inquiries = await simulateApiCall([
            {
                id: 1,
                inquirer: {
                    name: 'Amit Patel',
                    avatar: 'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=AP',
                    email: 'amit.patel@email.com',
                    phone: '+91 98765 43210'
                },
                property: 'Modern Office Space in Salt Lake',
                message: "I'm interested in this office space for my startup. Can we schedule a visit?",
                time: '2 hours ago',
                status: 'unread'
            }
        ]);
        
        dashboardState.inquiries = inquiries;
        updateInquiriesDisplay();
        
    } catch (error) {
        console.error('Error loading inquiries:', error);
        showEmptyState('inquiries');
    }
}

function updateInquiriesDisplay() {
    const inquiriesList = document.getElementById('inquiriesList');
    const emptyInquiries = document.getElementById('emptyInquiries');
    
    if (!inquiriesList) return;
    
    if (dashboardState.inquiries.length === 0) {
        showEmptyState('inquiries');
        return;
    }
    
    // Hide empty state
    if (emptyInquiries) emptyInquiries.style.display = 'none';
    
    // Clear existing content
    inquiriesList.innerHTML = '';
    
    // Add inquiries
    dashboardState.inquiries.forEach(inquiry => {
        const inquiryItem = createInquiryItem(inquiry);
        inquiriesList.appendChild(inquiryItem);
    });
}

function createInquiryItem(inquiry) {
    const item = document.createElement('div');
    item.className = 'inquiry-item';
    item.innerHTML = `
        <div class="inquiry-header">
            <div class="inquirer-info">
                <img src="${inquiry.inquirer.avatar}" alt="${inquiry.inquirer.name}" class="inquirer-avatar">
                <div>
                    <div class="inquirer-name">${inquiry.inquirer.name}</div>
                    <div class="inquiry-time">${inquiry.time}</div>
                </div>
            </div>
            <div class="inquiry-status ${inquiry.status}">
                <i class="fas fa-circle"></i>
                ${inquiry.status === 'unread' ? 'New' : 'Read'}
            </div>
        </div>
        <div class="inquiry-property">${inquiry.property}</div>
        <div class="inquiry-message">${inquiry.message}</div>
        <div class="inquiry-contact">
            <span class="contact-item">
                <i class="fas fa-envelope"></i>
                ${inquiry.inquirer.email}
            </span>
            <span class="contact-item">
                <i class="fas fa-phone"></i>
                ${inquiry.inquirer.phone}
            </span>
        </div>
        <div class="inquiry-actions">
            <button class="btn btn-sm btn-primary" onclick="replyToInquiry(${inquiry.id})">
                <i class="fas fa-reply"></i>
                Reply
            </button>
            <button class="btn btn-sm btn-secondary" onclick="markAsRead(${inquiry.id})">
                <i class="fas fa-check"></i>
                Mark Read
            </button>
            <button class="btn btn-sm btn-outline" onclick="scheduleVisit(${inquiry.id})">
                <i class="fas fa-calendar"></i>
                Schedule
            </button>
        </div>
    `;
    
    return item;
}

function showEmptyState(type) {
    const listElement = document.getElementById(`${type}List`);
    const emptyElement = document.getElementById(`empty${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (listElement) listElement.style.display = 'none';
    if (emptyElement) emptyElement.style.display = 'block';
}

function initializeInteractiveElements() {
    // Initialize tooltips for mobile
    if (window.innerWidth <= 768) {
        initializeMobileTooltips();
    }
    
    // Initialize swipe gestures for mobile
    initializeSwipeGestures();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
}

function initializeMobileTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            showTooltip(this, this.getAttribute('data-tooltip'));
        });
    });
}

function initializeSwipeGestures() {
    // Add swipe gestures for property and inquiry cards on mobile
    if (window.innerWidth <= 768) {
        const swipeableElements = document.querySelectorAll('.property-card, .inquiry-item');
        
        swipeableElements.forEach(element => {
            let startX, startY, distX, distY;
            
            element.addEventListener('touchstart', function(e) {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
            });
            
            element.addEventListener('touchmove', function(e) {
                e.preventDefault();
            });
            
            element.addEventListener('touchend', function(e) {
                const touch = e.changedTouches[0];
                distX = touch.clientX - startX;
                distY = touch.clientY - startY;
                
                // Detect swipe direction
                if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
                    if (distX > 0) {
                        // Swipe right - show quick actions
                        showQuickActions(this);
                    } else {
                        // Swipe left - hide quick actions
                        hideQuickActions(this);
                    }
                }
            });
        });
    }
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only if no input is focused
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'n':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.location.href = 'list-property.html';
                }
                break;
            case 'r':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    refreshDashboard();
                }
                break;
            case 'Escape':
                closeAllModals();
                break;
        }
    });
}

function setLoadingState(loading) {
    dashboardState.loading = loading;
    const mainElement = document.querySelector('.dashboard-main');
    
    if (loading) {
        mainElement?.classList.add('loading');
    } else {
        mainElement?.classList.remove('loading');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility function to simulate API calls
function simulateApiCall(data, delay = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}

// Dashboard Action Functions
function editProperty(propertyId) {
    console.log('Editing property:', propertyId);
    // Redirect to edit property page
    window.location.href = `list-property.html?edit=${propertyId}`;
}

function viewInquiries(propertyId) {
    console.log('Viewing inquiries for property:', propertyId);
    showNotification(`Viewing inquiries for property ${propertyId}`, 'info');
}

function viewAnalytics(propertyId = null) {
    console.log('Viewing analytics:', propertyId || 'overview');
    showNotification('Analytics feature coming soon!', 'info');
}

function replyToInquiry(inquiryId) {
    console.log('Replying to inquiry:', inquiryId);
    showNotification('Reply feature coming soon!', 'info');
}

function markAsRead(inquiryId) {
    console.log('Marking inquiry as read:', inquiryId);
    const inquiry = dashboardState.inquiries.find(i => i.id === inquiryId);
    if (inquiry) {
        inquiry.status = 'read';
        updateInquiriesDisplay();
        showNotification('Inquiry marked as read', 'success');
    }
}

function scheduleVisit(inquiryId) {
    console.log('Scheduling visit for inquiry:', inquiryId);
    showNotification('Scheduling feature coming soon!', 'info');
}

function viewAllProperties() {
    console.log('Viewing all properties');
    showNotification('Redirecting to properties page...', 'info');
}

function viewAllInquiries() {
    console.log('Viewing all inquiries');
    showNotification('Redirecting to inquiries page...', 'info');
}

function refreshDashboard() {
    console.log('Refreshing dashboard...');
    initializeDashboard();
    showNotification('Dashboard refreshed!', 'success');
}

function exportData() {
    console.log('Exporting dashboard data');
    showNotification('Export feature coming soon!', 'info');
}

function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    showNotification('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 1000);
}

// Mobile-specific helper functions
function showQuickActions(element) {
    element.classList.add('show-quick-actions');
}

function hideQuickActions(element) {
    element.classList.remove('show-quick-actions');
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'mobile-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.bottom + 10 + 'px';
    
    setTimeout(() => tooltip.remove(), 3000);
}

function closeAllModals() {
    document.querySelectorAll('.user-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Performance optimization
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

// Optimized resize handler
const handleResize = debounce(() => {
    adjustForOrientation();
}, 250);

window.addEventListener('resize', handleResize);

// Export functions for global access
window.editProperty = editProperty;
window.viewInquiries = viewInquiries;
window.viewAnalytics = viewAnalytics;
window.replyToInquiry = replyToInquiry;
window.markAsRead = markAsRead;
window.scheduleVisit = scheduleVisit;
window.viewAllProperties = viewAllProperties;
window.viewAllInquiries = viewAllInquiries;
window.refreshDashboard = refreshDashboard;
window.exportData = exportData;
window.logout = logout;