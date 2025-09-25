// Admin Panel JavaScript
const API_BASE = CONFIG.API_BASE;

document.addEventListener('DOMContentLoaded', initAdmin);

async function initAdmin() {
    // Check admin authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Load dashboard data
    await loadDashboardStats();
    await loadRecentActivity();
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active to clicked menu item
    event.target.classList.add('active');
    
    // Load section data
    switch(sectionId) {
        case 'users':
            loadUsers();
            break;
        case 'properties':
            loadProperties();
            break;
        case 'inquiries':
            loadInquiries();
            break;
        case 'verifications':
            loadVerifications();
            break;
    }
}

async function loadDashboardStats() {
    try {
        // Load users
        const usersResponse = await fetch(`${API_BASE}/users`);
        const usersData = await usersResponse.json();
        
        // Load properties
        const propertiesResponse = await fetch(`${API_BASE}/properties`);
        const propertiesData = await propertiesResponse.json();
        
        // Load inquiries
        const inquiriesResponse = await fetch(`${API_BASE}/inquiries`);
        const inquiriesData = await inquiriesResponse.json();
        
        // Update stats
        document.getElementById('totalUsers').textContent = usersData.total || 0;
        document.getElementById('totalProperties').textContent = propertiesData.total || 0;
        document.getElementById('totalInquiries').textContent = inquiriesData.total || 0;
        
        // Count verified users
        const verifiedCount = usersData.users ? 
            usersData.users.filter(u => u.isVerified).length : 0;
        document.getElementById('verifiedUsers').textContent = verifiedCount;
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    // Mock recent activity data
    const activities = [
        { icon: 'fas fa-user-plus', text: 'New user registered', time: '2 minutes ago' },
        { icon: 'fas fa-building', text: 'New property listed', time: '15 minutes ago' },
        { icon: 'fas fa-envelope', text: 'New inquiry received', time: '1 hour ago' },
        { icon: 'fas fa-check-circle', text: 'User verification completed', time: '2 hours ago' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <p>${activity.text}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        const data = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = data.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td><span class="status-badge">${user.userType}</span></td>
                <td><span class="status-badge ${user.isVerified ? 'status-verified' : 'status-pending'}">
                    ${user.isVerified ? 'Verified' : 'Pending'}
                </span></td>
                <td>${formatDate(user.createdAt)}</td>
                <td>
                    <button class="btn-success" onclick="approveUser(${user.id})">Approve</button>
                    <button class="btn-danger" onclick="suspendUser(${user.id})">Suspend</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadProperties() {
    try {
        const response = await fetch(`${API_BASE}/properties`);
        const data = await response.json();
        
        const tbody = document.getElementById('propertiesTableBody');
        tbody.innerHTML = data.properties.map(property => `
            <tr>
                <td>${property.id}</td>
                <td>${property.title}</td>
                <td>${property.location}</td>
                <td>${property.type}</td>
                <td>₹${property.rent.toLocaleString()}</td>
                <td>${property.userEmail || 'N/A'}</td>
                <td><span class="status-badge ${property.verified ? 'status-verified' : 'status-pending'}">
                    ${property.verified ? 'Approved' : 'Pending'}
                </span></td>
                <td>
                    <button class="btn-success" onclick="approveProperty(${property.id})">Approve</button>
                    <button class="btn-danger" onclick="deleteProperty(${property.id})">Delete</button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

async function loadInquiries() {
    try {
        const response = await fetch(`${API_BASE}/inquiries`);
        const data = await response.json();
        
        const container = document.getElementById('inquiriesList');
        container.innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Property ID</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.inquiries.map(inquiry => `
                            <tr>
                                <td>${inquiry.id}</td>
                                <td>${inquiry.name}</td>
                                <td>${inquiry.email}</td>
                                <td>${inquiry.propertyId}</td>
                                <td>${inquiry.message.substring(0, 50)}...</td>
                                <td>${formatDate(inquiry.createdAt)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading inquiries:', error);
    }
}

async function loadVerifications() {
    const container = document.getElementById('verificationsList');
    container.innerHTML = `
        <div class="verification-requests">
            <p>Verification management coming soon...</p>
            <p>This will show pending phone and PAN verifications for manual review.</p>
        </div>
    `;
}

function refreshUsers() {
    loadUsers();
}

function refreshProperties() {
    loadProperties();
}

function approveUser(userId) {
    if (confirm('Approve this user?')) {
        alert(`User ${userId} approved! (Feature coming soon)`);
    }
}

function suspendUser(userId) {
    if (confirm('Suspend this user?')) {
        alert(`User ${userId} suspended! (Feature coming soon)`);
    }
}

function approveProperty(propertyId) {
    if (confirm('Approve this property?')) {
        alert(`Property ${propertyId} approved! (Feature coming soon)`);
    }
}

function deleteProperty(propertyId) {
    if (confirm('Delete this property?')) {
        alert(`Property ${propertyId} deleted! (Feature coming soon)`);
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}

function adminLogout() {
    localStorage.removeItem('authToken');
    window.location.href = 'auth.html';
}