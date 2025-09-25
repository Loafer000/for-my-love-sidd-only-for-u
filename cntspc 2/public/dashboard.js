// Dashboard - Real User Data
// Import secure config
// const API_BASE = 'http://localhost:3000/api'; // REMOVED - Security risk
const API_BASE = CONFIG.API_BASE; // Secure dynamic configuration

document.addEventListener('DOMContentLoaded', loadDashboard);

async function loadDashboard() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }
    
    try {
        // Load user's properties
        const propertiesResponse = await fetch(`${API_BASE}/properties/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const propertiesData = await propertiesResponse.json();
        
        // Load user's inquiries
        const inquiriesResponse = await fetch(`${API_BASE}/inquiries/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const inquiriesData = await inquiriesResponse.json();
        
        displayStats(propertiesData.properties, inquiriesData.inquiries);
        displayProperties(propertiesData.properties);
        displayInquiries(inquiriesData.inquiries, propertiesData.properties);
        
    } catch (error) {
        console.error('Dashboard error:', error);
        document.getElementById('dashboardContent').innerHTML = 
            '<div class="error">Failed to load dashboard. Please try again.</div>';
    }
}

function displayStats(properties, inquiries) {
    document.getElementById('totalListings').textContent = properties.length;
    document.getElementById('verifiedListings').textContent = 
        properties.filter(p => p.verified).length;
    document.getElementById('totalInquiries').textContent = inquiries.length;
}

function displayProperties(properties) {
    const container = document.querySelector('.property-grid');
    
    if (properties.length === 0) {
        container.innerHTML = `
            <div class="no-properties">
                <h3>No properties listed yet</h3>
                <p>Start by adding your first property</p>
                <a href="list-property.html" class="btn-primary">Add Property</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = properties.map(property => `
        <div class="property-card">
            <div class="property-image">
                <i class="fas fa-building" style="font-size: 2rem; color: #667eea;"></i>
            </div>
            <div class="property-info">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-price">₹${property.rent.toLocaleString()}/month</div>
                <div class="property-details">
                    <p><strong>Type:</strong> ${property.type}</p>
                    <p><strong>Size:</strong> ${property.size} sq ft</p>
                    <p><strong>Status:</strong> 
                        ${property.verified ? 
                            '<span class="verified-badge">✓ Verified</span>' : 
                            '<span class="pending-badge">⏳ Pending</span>'
                        }
                    </p>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn-primary" onclick="editProperty(${property.id})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="btn-secondary" onclick="viewPropertyInquiries(${property.id})" style="margin-right: 0.5rem;">
                        Inquiries (${getInquiryCount(property.id)})
                    </button>
                    <button class="btn-danger" onclick="deleteProperty(${property.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function displayInquiries(inquiries, properties) {
    const container = document.querySelector('.inquiry-list');
    
    if (inquiries.length === 0) {
        container.innerHTML = '<div class="no-inquiries">No inquiries yet</div>';
        return;
    }
    
    container.innerHTML = inquiries.slice(0, 5).map(inquiry => {
        const property = properties.find(p => p.id == inquiry.propertyId);
        return `
            <div class="inquiry-item">
                <div class="inquiry-header">
                    <strong>${inquiry.name}</strong>
                    <span class="inquiry-date">${formatDate(inquiry.createdAt)}</span>
                </div>
                <div class="inquiry-property">${property ? property.title : 'Property'}</div>
                <div class="inquiry-message">${inquiry.message}</div>
                <div class="inquiry-contact">
                    <span>📧 ${inquiry.email}</span>
                    <span>📱 ${inquiry.phone}</span>
                </div>
                <div class="inquiry-actions">
                    <button class="btn-primary" onclick="replyToInquiry('${inquiry.email}', '${inquiry.name}', ${inquiry.propertyId})">Reply</button>
                    <a href="tel:${inquiry.phone}" class="btn-secondary">Call</a>
                    <button class="btn-success" onclick="sendEmailNotification('${inquiry.email}', '${inquiry.name}', ${inquiry.id})">Send Email</button>
                </div>
            </div>
        `;
    }).join('');
}

function getInquiryCount(propertyId) {
    // This will be populated when inquiries are loaded
    return 0;
}

function viewPropertyInquiries(propertyId) {
    alert(`Viewing inquiries for property ${propertyId}`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) return `${Math.floor(diff/60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)} hours ago`;
    return `${Math.floor(diff/86400000)} days ago`;
}

async function editProperty(propertyId) {
    const property = await getPropertyById(propertyId);
    if (!property) return;
    
    const newTitle = prompt('Property Title:', property.title);
    const newRent = prompt('Monthly Rent (₹):', property.rent);
    const newDescription = prompt('Description:', property.description);
    
    if (newTitle && newRent) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE}/properties/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newTitle,
                    rent: parseInt(newRent),
                    description: newDescription
                })
            });
            
            if (response.ok) {
                alert('Property updated successfully!');
                loadDashboard();
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            alert('Failed to update property');
        }
    }
}

async function deleteProperty(propertyId) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/properties/${propertyId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            alert('Property deleted successfully!');
            loadDashboard();
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        alert('Failed to delete property');
    }
}

async function getPropertyById(propertyId) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE}/properties/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        return data.properties.find(p => p.id === propertyId);
    } catch (error) {
        return null;
    }
}

async function replyToInquiry(email, name, propertyId) {
    const property = await getPropertyById(propertyId);
    const subject = `Re: Inquiry for ${property ? property.title : 'Property'}`;
    const message = prompt(`Reply to ${name}:`, `Hi ${name},\n\nThank you for your interest in our property. I would be happy to discuss further details.\n\nBest regards`);
    
    if (message) {
        await sendEmailNotification(email, name, null, subject, message);
    }
}

async function sendEmailNotification(email, name, inquiryId, customSubject = null, customMessage = null) {
    const subject = customSubject || `Property Inquiry Response - ConnectSpace`;
    const message = customMessage || `Dear ${name},\n\nThank you for your inquiry. We will get back to you soon.\n\nBest regards,\nConnectSpace Team`;
    
    try {
        const response = await fetch(`${API_BASE}/inquiries/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: email,
                subject: subject,
                message: message,
                inquiryId: inquiryId
            })
        });
        
        if (response.ok) {
            alert(`Email sent to ${email} successfully!`);
        } else {
            throw new Error('Email send failed');
        }
    } catch (error) {
        alert('Failed to send email notification');
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'auth.html';
}