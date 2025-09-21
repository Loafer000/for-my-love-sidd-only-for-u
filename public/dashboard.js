// Modern Dashboard - Enhanced User Experience
const API_BASE = CONFIG?.API_BASE || 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', initializeDashboard);

async function initializeDashboard() {
    // Check authentication
    if (!checkAuth()) return;
    
    // Load demo data (replace with real API calls)
    loadDemoData();
    
    // Initialize UI components
    initializeUserMenu();
}

function checkAuth() {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const userType = localStorage.getItem('userType');
    
    if (!userLoggedIn) {
        window.location.href = 'auth.html';
        return false;
    }
    
    // Update user info in header
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = userType === 'landlord' ? 'Landlord' : 'Tenant';
    }
    
    return true;
}

function loadDemoData() {
    // Demo stats
    document.getElementById('totalListings').textContent = '5';
    document.getElementById('verifiedListings').textContent = '4';
    document.getElementById('totalInquiries').textContent = '12';
    
    // Load demo properties
    loadDemoProperties();
    
    // Load demo inquiries
    loadDemoInquiries();
}

function loadDemoProperties() {
    const propertiesList = document.getElementById('propertiesList');
    const emptyProperties = document.getElementById('emptyProperties');
    
    // Demo property data
    const properties = [
        {
            id: 1,
            title: 'Modern Office Space in Salt Lake',
            price: '45,000',
            type: 'Office',
            size: '1200',
            views: 45,
            inquiries: 3,
            verified: true,
            image: 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Office+Space'
        },
        {
            id: 2,
            title: 'Luxury Apartment in Park Street',
            price: '35,000',
            type: 'Apartment',
            size: '900',
            views: 32,
            inquiries: 5,
            verified: true,
            image: 'https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Apartment'
        }
    ];
    
    if (properties.length === 0) {
        propertiesList.innerHTML = '';
        emptyProperties.style.display = 'block';
        return;
    }
    
    emptyProperties.style.display = 'none';
    propertiesList.innerHTML = properties.map(property => `
        <div class="property-card">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}">
                <div class="property-status ${property.verified ? 'verified' : 'pending'}">
                    <i class="fas fa-${property.verified ? 'check-circle' : 'clock'}"></i>
                    ${property.verified ? 'Verified' : 'Pending'}
                </div>
            </div>
            <div class="property-details">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-price">₹${property.price}/month</div>
                <div class="property-meta">
                    <span class="meta-item">
                        <i class="fas fa-home"></i>
                        ${property.type}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-ruler-combined"></i>
                        ${property.size} sq ft
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
        </div>
    `).join('');
}

function loadDemoInquiries() {
    const inquiriesList = document.getElementById('inquiriesList');
    const emptyInquiries = document.getElementById('emptyInquiries');
    
    // Demo inquiry data
    const inquiries = [
        {
            id: 1,
            name: 'Amit Patel',
            email: 'amit.patel@email.com',
            phone: '+91 98765 43210',
            property: 'Modern Office Space in Salt Lake',
            message: "I'm interested in this office space for my startup. Can we schedule a visit?",
            time: '2 hours ago',
            status: 'unread',
            avatar: 'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=AP'
        },
        {
            id: 2,
            name: 'Priya Singh',
            email: 'priya.singh@email.com',
            phone: '+91 98765 43211',
            property: 'Luxury Apartment in Park Street',
            message: "Is this apartment still available? I'd like to know more about the amenities.",
            time: '5 hours ago',
            status: 'read',
            avatar: 'https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=PS'
        }
    ];
    
    if (inquiries.length === 0) {
        inquiriesList.innerHTML = '';
        emptyInquiries.style.display = 'block';
        return;
    }
    
    emptyInquiries.style.display = 'none';
    inquiriesList.innerHTML = inquiries.map(inquiry => `
        <div class="inquiry-item">
            <div class="inquiry-header">
                <div class="inquirer-info">
                    <img src="${inquiry.avatar}" alt="${inquiry.name}" class="inquirer-avatar">
                    <div>
                        <div class="inquirer-name">${inquiry.name}</div>
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
                    ${inquiry.email}
                </span>
                <span class="contact-item">
                    <i class="fas fa-phone"></i>
                    ${inquiry.phone}
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
        </div>
    `).join('');
}

function initializeUserMenu() {
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.style.opacity = userDropdown.style.opacity === '1' ? '0' : '1';
            userDropdown.style.visibility = userDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
        });
        
        document.addEventListener('click', () => {
            userDropdown.style.opacity = '0';
            userDropdown.style.visibility = 'hidden';
        });
    }
}

// Action Functions
function editProperty(propertyId) {
    alert(`Editing property ${propertyId}. This will redirect to the edit form.`);
    // window.location.href = `edit-property.html?id=${propertyId}`;
}

function viewInquiries(propertyId) {
    alert(`Viewing all inquiries for property ${propertyId}. This will open a detailed inquiry manager.`);
    // window.location.href = `property-inquiries.html?id=${propertyId}`;
}

function viewAnalytics(propertyId = null) {
    if (propertyId) {
        alert(`Viewing analytics for property ${propertyId}. This will show detailed performance metrics.`);
    } else {
        alert('Viewing overall analytics dashboard with charts and insights.');
    }
    // window.location.href = propertyId ? `property-analytics.html?id=${propertyId}` : 'analytics.html';
}

function replyToInquiry(inquiryId) {
    const message = prompt('Enter your reply message:');
    if (message) {
        alert(`Reply sent to inquiry ${inquiryId}! In a real application, this would send an email.`);
        // Implement actual email sending here
    }
}

function markAsRead(inquiryId) {
    alert(`Inquiry ${inquiryId} marked as read.`);
    // Update inquiry status in database
    loadDemoInquiries(); // Refresh the list
}

function scheduleVisit(inquiryId) {
    const date = prompt('Enter preferred visit date (YYYY-MM-DD):');
    if (date) {
        alert(`Visit scheduled for inquiry ${inquiryId} on ${date}!`);
        // Implement calendar integration here
    }
}

function manageInquiries() {
    alert('Opening comprehensive inquiry management panel.');
    // window.location.href = 'inquiries.html';
}

function viewAllProperties() {
    alert('Viewing all properties in a detailed grid view.');
    // window.location.href = 'my-properties.html';
}

function viewAllInquiries() {
    alert('Viewing all inquiries with advanced filtering options.');
    // window.location.href = 'all-inquiries.html';
}

function exportData() {
    alert('Exporting dashboard data to CSV/Excel format.');
    // Implement data export functionality
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        window.location.href = 'auth.html';
    }
}