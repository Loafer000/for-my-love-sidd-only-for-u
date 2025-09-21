/* ===== MODERN ADMIN DASHBOARD JAVASCRIPT ===== */

// Global variables
let currentSection = 'dashboard';
let currentData = {
    users: [],
    properties: [],
    inquiries: [],
    verifications: []
};

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadDashboardData();
    setupEventListeners();
});

// ===== INITIALIZATION ===== 
function initializeAdmin() {
    console.log('🚀 Modern Admin Dashboard Initialized');
    
    // Check authentication
    if (!checkAdminAuth()) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Set initial active section
    showSection('dashboard');
    
    // Load initial data
    refreshDashboard();
}

function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    return token && userType === 'admin';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Search functionality
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
        userSearch.addEventListener('input', debounce(filterUsers, 300));
    }
    
    const propertySearch = document.getElementById('propertySearch');
    if (propertySearch) {
        propertySearch.addEventListener('input', debounce(filterProperties, 300));
    }
    
    // Filter dropdowns
    const userFilter = document.getElementById('userFilter');
    if (userFilter) {
        userFilter.addEventListener('change', filterUsers);
    }
    
    const propertyFilter = document.getElementById('propertyFilter');
    if (propertyFilter) {
        propertyFilter.addEventListener('change', filterProperties);
    }
    
    // Analytics timeframe
    const analyticsTimeframe = document.getElementById('analyticsTimeframe');
    if (analyticsTimeframe) {
        analyticsTimeframe.addEventListener('change', updateAnalytics);
    }
    
    // Mobile menu
    window.addEventListener('resize', handleResize);
}

// ===== NAVIGATION =====
function showSection(sectionId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Activate new section
    const navItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        currentSection = sectionId;
        
        // Load section-specific data
        loadSectionData(sectionId);
    }
}

function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            refreshDashboard();
            break;
        case 'users':
            refreshUsers();
            break;
        case 'properties':
            refreshProperties();
            break;
        case 'inquiries':
            refreshInquiries();
            break;
        case 'verifications':
            refreshVerifications();
            break;
        case 'analytics':
            updateAnalytics();
            break;
        default:
            break;
    }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('mobile-open');
}

function handleResize() {
    const sidebar = document.getElementById('adminSidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('mobile-open');
    }
}

// ===== DASHBOARD FUNCTIONS =====
async function refreshDashboard() {
    showLoadingState();
    
    try {
        await Promise.all([
            loadDashboardStats(),
            loadRecentActivity(),
            updateHeaderStats()
        ]);
        
        hideLoadingState();
        
        // Add some animation
        animateStatCards();
        
    } catch (error) {
        console.error('Error refreshing dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

async function loadDashboardStats() {
    try {
        // Simulate API calls with actual backend integration
        const [usersResponse, propertiesResponse, inquiriesResponse] = await Promise.all([
            fetch('/api/admin/users/count'),
            fetch('/api/admin/properties/count'),
            fetch('/api/admin/inquiries/count')
        ]);
        
        // For demo purposes, use mock data
        const stats = {
            users: Math.floor(Math.random() * 1000) + 500,
            properties: Math.floor(Math.random() * 500) + 200,
            inquiries: Math.floor(Math.random() * 100) + 50,
            verified: Math.floor(Math.random() * 800) + 400
        };
        
        updateStatsDisplay(stats);
        
    } catch (error) {
        // Use fallback data
        console.log('Using fallback data for demo');
        const stats = {
            users: 847,
            properties: 324,
            inquiries: 76,
            verified: 623
        };
        updateStatsDisplay(stats);
    }
}

function updateStatsDisplay(stats) {
    animateNumber('totalUsers', stats.users);
    animateNumber('totalProperties', stats.properties);
    animateNumber('totalInquiries', stats.inquiries);
    animateNumber('verifiedUsers', stats.verified);
}

function updateHeaderStats() {
    const headerUsersCount = document.getElementById('headerUsersCount');
    const headerPropertiesCount = document.getElementById('headerPropertiesCount');
    
    if (headerUsersCount) {
        headerUsersCount.textContent = document.getElementById('totalUsers').textContent || '0';
    }
    
    if (headerPropertiesCount) {
        headerPropertiesCount.textContent = document.getElementById('totalProperties').textContent || '0';
    }
}

async function loadRecentActivity() {
    // Mock recent activity data
    const activities = [
        {
            icon: 'fas fa-user-plus',
            iconClass: 'text-primary',
            text: 'New user registration: john.doe@email.com',
            time: '2 minutes ago'
        },
        {
            icon: 'fas fa-home',
            iconClass: 'text-secondary',
            text: 'Property listing updated: Modern Apartment in Downtown',
            time: '15 minutes ago'
        },
        {
            icon: 'fas fa-check',
            iconClass: 'text-success',
            text: 'User verification approved: sarah.wilson@email.com',
            time: '1 hour ago'
        },
        {
            icon: 'fas fa-envelope',
            iconClass: 'text-accent',
            text: 'New inquiry received for Luxury Villa',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-building',
            iconClass: 'text-secondary',
            text: 'Property listing submitted for review',
            time: '3 hours ago'
        }
    ];
    
    const activityList = document.getElementById('activityList');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon} ${activity.iconClass}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <small>${activity.time}</small>
                </div>
            </div>
        `).join('');
    }
}

// ===== USER MANAGEMENT =====
async function refreshUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    showTableLoading(tableBody);
    
    try {
        // Mock user data
        const users = generateMockUsers();
        currentData.users = users;
        
        renderUsersTable(users);
        updateBadges();
        
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('Failed to load users', 'error');
    }
}

function generateMockUsers() {
    const names = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emma Davis', 'Alex Brown', 'Lisa Garcia', 'Tom Wilson', 'Anna Martinez'];
    const emails = ['john.doe@email.com', 'sarah.wilson@email.com', 'mike.johnson@email.com', 'emma.davis@email.com'];
    const types = ['tenant', 'landlord'];
    const statuses = ['verified', 'unverified', 'pending'];
    
    return Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)],
        email: `user${i + 1}@email.com`,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        propertyCount: Math.floor(Math.random() * 5)
    }));
}

function renderUsersTable(users) {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                        ${user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div style="font-weight: 600;">${user.name}</div>
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge ${user.type === 'landlord' ? 'badge-primary' : 'badge-secondary'}">
                    ${user.type}
                </span>
            </td>
            <td>
                <span class="badge ${getStatusBadgeClass(user.status)}">
                    ${user.status}
                </span>
            </td>
            <td>${user.joinDate}</td>
            <td>${user.propertyCount}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm btn-outline" onclick="viewUser(${user.id})" title="View User">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editUser(${user.id})" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const filterType = document.getElementById('userFilter')?.value || 'all';
    
    let filteredUsers = currentData.users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesFilter = filterType === 'all' || user.type === filterType || user.status === filterType;
        
        return matchesSearch && matchesFilter;
    });
    
    renderUsersTable(filteredUsers);
}

// ===== PROPERTY MANAGEMENT =====
async function refreshProperties() {
    const tableBody = document.getElementById('propertiesTableBody');
    if (!tableBody) return;
    
    showTableLoading(tableBody);
    
    try {
        const properties = generateMockProperties();
        currentData.properties = properties;
        
        renderPropertiesTable(properties);
        updateBadges();
        
    } catch (error) {
        console.error('Error loading properties:', error);
        showNotification('Failed to load properties', 'error');
    }
}

function generateMockProperties() {
    const titles = ['Modern Apartment', 'Luxury Villa', 'Cozy Studio', 'Family House', 'Downtown Loft', 'Garden Apartment'];
    const locations = ['Downtown', 'Suburb Area', 'City Center', 'Residential Zone', 'Business District'];
    const types = ['apartment', 'house', 'studio', 'villa'];
    const statuses = ['active', 'pending', 'suspended'];
    const owners = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emma Davis'];
    
    return Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `${titles[Math.floor(Math.random() * titles.length)]} ${i + 1}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        type: types[Math.floor(Math.random() * types.length)],
        rent: Math.floor(Math.random() * 2000) + 500,
        owner: owners[Math.floor(Math.random() * owners.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        image: `https://picsum.photos/60/60?random=${i}`
    }));
}

function renderPropertiesTable(properties) {
    const tableBody = document.getElementById('propertiesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = properties.map(property => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${property.image}" alt="${property.title}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                    <div>
                        <div style="font-weight: 600;">${property.title}</div>
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">ID: ${property.id}</div>
                    </div>
                </div>
            </td>
            <td>${property.location}</td>
            <td>
                <span class="badge badge-secondary">${property.type}</span>
            </td>
            <td style="font-weight: 600;">$${property.rent}/mo</td>
            <td>${property.owner}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(property.status)}">
                    ${property.status}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm btn-outline" onclick="viewProperty(${property.id})" title="View Property">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editProperty(${property.id})" title="Edit Property">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProperty(${property.id})" title="Delete Property">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterProperties() {
    const searchTerm = document.getElementById('propertySearch')?.value.toLowerCase() || '';
    const filterType = document.getElementById('propertyFilter')?.value || 'all';
    
    let filteredProperties = currentData.properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) || 
                            property.location.toLowerCase().includes(searchTerm);
        const matchesFilter = filterType === 'all' || property.status === filterType;
        
        return matchesSearch && matchesFilter;
    });
    
    renderPropertiesTable(filteredProperties);
}

// ===== INQUIRIES MANAGEMENT =====
async function refreshInquiries() {
    // Mock implementation
    console.log('Refreshing inquiries...');
    updateBadges();
}

// ===== VERIFICATIONS MANAGEMENT =====
async function refreshVerifications() {
    // Mock implementation
    console.log('Refreshing verifications...');
    updateBadges();
}

// ===== ANALYTICS =====
function updateAnalytics() {
    const timeframe = document.getElementById('analyticsTimeframe')?.value || '30';
    console.log(`Updating analytics for ${timeframe} days`);
    
    // Mock analytics update
    showNotification(`Analytics updated for last ${timeframe} days`, 'success');
}

// ===== SETTINGS =====
function saveSettings() {
    const settings = {
        platformActive: document.getElementById('platformActive')?.checked,
        allowRegistrations: document.getElementById('allowRegistrations')?.checked,
        maintenanceMode: document.getElementById('maintenanceMode')?.checked,
        emailVerificationRequired: document.getElementById('emailVerificationRequired')?.checked,
        autoApproveProperties: document.getElementById('autoApproveProperties')?.checked,
        newUserNotifications: document.getElementById('newUserNotifications')?.checked,
        propertyNotifications: document.getElementById('propertyNotifications')?.checked
    };
    
    console.log('Saving settings:', settings);
    
    // Simulate save
    setTimeout(() => {
        showNotification('Settings saved successfully', 'success');
    }, 500);
}

// ===== ACTIONS =====
function viewUser(userId) {
    console.log('Viewing user:', userId);
    showNotification(`Viewing user ${userId}`, 'info');
}

function editUser(userId) {
    console.log('Editing user:', userId);
    showNotification(`Editing user ${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        console.log('Deleting user:', userId);
        showNotification(`User ${userId} deleted`, 'success');
        refreshUsers();
    }
}

function viewProperty(propertyId) {
    console.log('Viewing property:', propertyId);
    showNotification(`Viewing property ${propertyId}`, 'info');
}

function editProperty(propertyId) {
    console.log('Editing property:', propertyId);
    showNotification(`Editing property ${propertyId}`, 'info');
}

function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        console.log('Deleting property:', propertyId);
        showNotification(`Property ${propertyId} deleted`, 'success');
        refreshProperties();
    }
}

function viewAllActivity() {
    console.log('Viewing all activity');
    showNotification('Opening activity log', 'info');
}

function downloadReport() {
    console.log('Downloading dashboard report');
    showNotification('Generating report...', 'info');
    
    setTimeout(() => {
        showNotification('Report downloaded successfully', 'success');
    }, 2000);
}

function downloadUserReport() {
    console.log('Downloading user report');
    showNotification('User report downloaded', 'success');
}

function downloadPropertyReport() {
    console.log('Downloading property report');
    showNotification('Property report downloaded', 'success');
}

function downloadAnalyticsReport() {
    console.log('Downloading analytics report');
    showNotification('Analytics report downloaded', 'success');
}

function generateReport() {
    console.log('Generating custom report');
    showNotification('Custom report generation started', 'info');
}

// ===== LOGOUT =====
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        window.location.href = 'auth.html';
    }
}

// ===== UTILITY FUNCTIONS =====
function getStatusBadgeClass(status) {
    const statusClasses = {
        'active': 'badge-success',
        'verified': 'badge-success',
        'pending': 'badge-warning',
        'unverified': 'badge-warning',
        'suspended': 'badge-danger',
        'rejected': 'badge-danger'
    };
    
    return statusClasses[status] || 'badge-secondary';
}

function updateBadges() {
    // Update navigation badges with pending counts
    const pendingUsers = Math.floor(Math.random() * 10);
    const pendingProperties = Math.floor(Math.random() * 5);
    const newInquiries = Math.floor(Math.random() * 15);
    const pendingVerifications = Math.floor(Math.random() * 8);
    
    updateBadge('pendingUsersBadge', pendingUsers);
    updateBadge('pendingPropertiesBadge', pendingProperties);
    updateBadge('newInquiriesBadge', newInquiries);
    updateBadge('pendingVerificationsBadge', pendingVerifications);
}

function updateBadge(badgeId, count) {
    const badge = document.getElementById(badgeId);
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startNumber = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(startNumber + (targetNumber - startNumber) * easeOutCubic(progress));
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'bounceIn 0.5s ease';
        }, index * 100);
    });
}

function showLoadingState() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.opacity = '0.7';
        dashboard.style.pointerEvents = 'none';
    }
}

function hideLoadingState() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.style.opacity = '1';
        dashboard.style.pointerEvents = 'auto';
    }
}

function showTableLoading(tableBody) {
    tableBody.innerHTML = `
        <tr>
            <td colspan="100%" style="text-align: center; padding: 2rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--color-primary);"></i>
                <p style="margin: 1rem 0 0 0; color: var(--color-text-secondary);">Loading data...</p>
            </td>
        </tr>
    `;
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

// Add notification styles to document
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-lg);
    border-left: 4px solid var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
}

.notification-success { border-left-color: var(--color-success); }
.notification-error { border-left-color: var(--color-danger); }
.notification-warning { border-left-color: var(--color-warning); }
.notification-info { border-left-color: var(--color-primary); }

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--color-text);
}

.notification-close {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
}

.notification-close:hover {
    background: var(--color-gray-100);
    color: var(--color-text);
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.badge-primary { background: var(--color-primary-light); color: var(--color-primary); }
.badge-secondary { background: var(--color-secondary-light); color: var(--color-secondary); }
.badge-success { background: var(--color-success-light); color: var(--color-success); }
.badge-warning { background: var(--color-warning-light); color: var(--color-warning); }
.badge-danger { background: var(--color-danger-light); color: var(--color-danger); }
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);