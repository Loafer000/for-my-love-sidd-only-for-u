// Property Details - Connect to Database
const API_BASE = 'http://localhost:3000/api';

// Load property details on page load
document.addEventListener('DOMContentLoaded', loadPropertyDetails);

async function loadPropertyDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (!propertyId) {
        showError('Property not found');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/properties`);
        const data = await response.json();
        const property = data.properties.find(p => p.id == propertyId);
        
        if (!property) {
            showError('Property not found');
            return;
        }
        
        displayProperty(property);
    } catch (error) {
        console.error('Error loading property:', error);
        showError('Failed to load property details');
    }
}

function displayProperty(property) {
    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('propertyPrice').textContent = `₹${property.rent.toLocaleString()}/month`;
    document.getElementById('propertySize').textContent = `${property.size} sq ft`;
    document.getElementById('propertyType').textContent = property.type;
    document.getElementById('propertyLocation').textContent = property.location;
    document.getElementById('propertyDescription').textContent = property.description || 'No description available';
    
    // Show verified badge if property is verified
    if (property.verified) {
        document.getElementById('verifiedBadge').style.display = 'inline-block';
    }
}

async function contactLandlord(event) {
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
        // Send inquiry
        const response = await fetch(`${API_BASE}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inquiryData)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Send email notification to landlord
            const property = await getCurrentProperty();
            if (property && property.userEmail) {
                await fetch(`${API_BASE}/inquiries/notify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: property.userEmail,
                        subject: `New Inquiry for ${property.title}`,
                        message: `You have received a new inquiry from ${inquiryData.name} (${inquiryData.email}) for your property "${property.title}".\n\nMessage: ${inquiryData.message}\n\nContact: ${inquiryData.phone}`,
                        inquiryId: result.inquiryId
                    })
                });
            }
            
            alert('Message sent successfully! The landlord has been notified and will contact you soon.');
            event.target.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending inquiry:', error);
        alert('Failed to send message. Please try again.');
    }
}

async function getCurrentProperty() {
    const propertyId = new URLSearchParams(window.location.search).get('id');
    try {
        const response = await fetch(`${API_BASE}/properties`);
        const data = await response.json();
        return data.properties.find(p => p.id == propertyId);
    } catch (error) {
        return null;
    }
}

function showError(message) {
    document.querySelector('.property-detail-container').innerHTML = `
        <div style="text-align: center; padding: 50px;">
            <h2>❌ ${message}</h2>
            <a href="search.html" class="btn-primary">Back to Search</a>
        </div>
    `;
}