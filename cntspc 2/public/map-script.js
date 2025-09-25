// Map functionality
let map;
let markers = [];
let radiusCircle;
let currentRadius = 2; // km

// Extensive sample properties with coordinates
const propertiesWithCoords = [
    // Salt Lake Area
    { id: 1, title: "Modern Office Space in Salt Lake", type: "office", location: "Salt Lake City, Kolkata", price: 45000, size: 1200, description: "Premium office space with modern amenities, AC, parking", verified: true, landlord: "Rajesh Kumar", phone: "+91 98765 43210", lat: 22.5726, lng: 88.3639 },
    { id: 2, title: "Tech Hub Office in Sector V", type: "office", location: "Sector V, Salt Lake, Kolkata", price: 52000, size: 1500, description: "IT office space with fiber internet, conference rooms", verified: true, landlord: "Amit Banerjee", phone: "+91 98765 43220", lat: 22.5744, lng: 88.4326 },
    { id: 3, title: "Startup Office in Salt Lake", type: "office", location: "Salt Lake Stadium Area, Kolkata", price: 28000, size: 800, description: "Affordable office for startups, shared facilities", verified: false, landlord: "Sneha Das", phone: "+91 98765 43221", lat: 22.5676, lng: 88.3594 },
    
    // Park Street & Central Kolkata
    { id: 4, title: "Retail Shop in Park Street", type: "retail", location: "Park Street, Kolkata", price: 35000, size: 800, description: "Prime retail location with high footfall, ground floor", verified: true, landlord: "Priya Sharma", phone: "+91 98765 43211", lat: 22.5448, lng: 88.3426 },
    { id: 5, title: "Restaurant Space in Park Street", type: "retail", location: "Park Street, Kolkata", price: 65000, size: 1200, description: "Perfect for restaurant, kitchen setup available", verified: true, landlord: "Rohit Agarwal", phone: "+91 98765 43222", lat: 22.5465, lng: 88.3445 },
    { id: 6, title: "Boutique Shop in Camac Street", type: "retail", location: "Camac Street, Kolkata", price: 42000, size: 600, description: "Upscale retail space, glass frontage", verified: true, landlord: "Meera Jain", phone: "+91 98765 43223", lat: 22.5389, lng: 88.3533 },
    
    // Howrah Industrial
    { id: 7, title: "Industrial Warehouse in Howrah", type: "industrial", location: "Howrah, West Bengal", price: 25000, size: 2500, description: "Large warehouse space for manufacturing", verified: false, landlord: "Suresh Gupta", phone: "+91 98765 43212", lat: 22.5958, lng: 88.2636 },
    { id: 8, title: "Manufacturing Unit in Shibpur", type: "industrial", location: "Shibpur, Howrah", price: 35000, size: 3000, description: "Heavy machinery compatible, power backup", verified: true, landlord: "Kamal Singh", phone: "+91 98765 43224", lat: 22.5697, lng: 88.3119 },
    { id: 9, title: "Storage Facility in Howrah", type: "industrial", location: "Howrah Station Area", price: 18000, size: 2000, description: "Cold storage facility, 24/7 security", verified: true, landlord: "Ravi Yadav", phone: "+91 98765 43225", lat: 22.5804, lng: 88.3299 },
    
    // New Town IT Hub
    { id: 10, title: "Office Space in New Town", type: "office", location: "New Town, Kolkata", price: 38000, size: 1000, description: "Modern office in IT hub", verified: true, landlord: "Anita Roy", phone: "+91 98765 43213", lat: 22.6203, lng: 88.4370 },
    { id: 11, title: "Corporate Office in Action Area", type: "office", location: "Action Area 1, New Town", price: 75000, size: 2000, description: "Premium corporate space, furnished", verified: true, landlord: "Vikash Gupta", phone: "+91 98765 43226", lat: 22.6156, lng: 88.4394 },
    { id: 12, title: "Co-working Space in New Town", type: "office", location: "Action Area 2, New Town", price: 15000, size: 500, description: "Flexible co-working space, hot desks available", verified: false, landlord: "Startup Hub", phone: "+91 98765 43227", lat: 22.6089, lng: 88.4456 },
    
    // Gariahat & South Kolkata
    { id: 13, title: "Retail Shop in Gariahat", type: "retail", location: "Gariahat, Kolkata", price: 48000, size: 900, description: "Busy shopping area, excellent visibility", verified: true, landlord: "Sanjay Dutta", phone: "+91 98765 43228", lat: 22.5186, lng: 88.3647 },
    { id: 14, title: "Medical Clinic Space", type: "office", location: "Gariahat More, Kolkata", price: 32000, size: 700, description: "Suitable for clinic, separate entrance", verified: true, landlord: "Dr. Ashok Sen", phone: "+91 98765 43229", lat: 22.5167, lng: 88.3678 },
    
    // Ballygunge Area
    { id: 15, title: "Office in Ballygunge", type: "office", location: "Ballygunge, Kolkata", price: 41000, size: 1100, description: "Professional office space, metro connectivity", verified: true, landlord: "Indira Ghosh", phone: "+91 98765 43230", lat: 22.5322, lng: 88.3667 },
    { id: 16, title: "Showroom in Ballygunge", type: "retail", location: "Ballygunge Circular Road", price: 55000, size: 1300, description: "Large showroom space, parking available", verified: false, landlord: "Rajesh Motors", phone: "+91 98765 43231", lat: 22.5289, lng: 88.3712 },
    
    // Esplanade & BBD Bagh
    { id: 17, title: "Commercial Office in BBD Bagh", type: "office", location: "BBD Bagh, Kolkata", price: 36000, size: 950, description: "Central business district, heritage building", verified: true, landlord: "Heritage Properties", phone: "+91 98765 43232", lat: 22.5697, lng: 88.3467 },
    { id: 18, title: "Trading Office in Burrabazar", type: "office", location: "Burrabazar, Kolkata", price: 22000, size: 600, description: "Perfect for trading business, wholesale market access", verified: true, landlord: "Gopal Agarwal", phone: "+91 98765 43233", lat: 22.5789, lng: 88.3578 },
    
    // Jadavpur & South
    { id: 19, title: "Research Lab Space", type: "office", location: "Jadavpur, Kolkata", price: 29000, size: 800, description: "Lab-ready space, university area", verified: true, landlord: "Academic Properties", phone: "+91 98765 43234", lat: 22.4989, lng: 88.3712 },
    { id: 20, title: "Cafe Space in Jadavpur", type: "retail", location: "Jadavpur University Area", price: 25000, size: 500, description: "Student area, high footfall, food license ready", verified: false, landlord: "Student Services", phone: "+91 98765 43235", lat: 22.4967, lng: 88.3689 },
    
    // Dum Dum & North
    { id: 21, title: "Warehouse near Airport", type: "industrial", location: "Dum Dum, Kolkata", price: 32000, size: 2200, description: "Airport proximity, logistics hub", verified: true, landlord: "Logistics Pro", phone: "+91 98765 43236", lat: 22.6456, lng: 88.4467 },
    { id: 22, title: "Office in Dum Dum", type: "office", location: "Dum Dum Cantonment", price: 26000, size: 750, description: "Government area, secure location", verified: true, landlord: "Secure Spaces", phone: "+91 98765 43237", lat: 22.6389, lng: 88.4156 },
    
    // Barasat & Outskirts
    { id: 23, title: "Manufacturing Unit in Barasat", type: "industrial", location: "Barasat, North 24 Parganas", price: 28000, size: 3500, description: "Large manufacturing space, highway access", verified: false, landlord: "Industrial Corp", phone: "+91 98765 43238", lat: 22.7211, lng: 88.4844 },
    { id: 24, title: "Retail Shop in Barasat", type: "retail", location: "Barasat Station Road", price: 18000, size: 400, description: "Local market area, affordable rent", verified: true, landlord: "Local Traders", phone: "+91 98765 43239", lat: 22.7189, lng: 88.4822 },
    
    // Garia & South Suburbs
    { id: 25, title: "Office Complex in Garia", type: "office", location: "Garia, Kolkata", price: 33000, size: 900, description: "Suburban office, metro connected", verified: true, landlord: "Suburban Properties", phone: "+91 98765 43240", lat: 22.4656, lng: 88.3889 },
    { id: 26, title: "Shopping Complex Space", type: "retail", location: "Garia More, Kolkata", price: 45000, size: 1100, description: "Mall space, food court area", verified: true, landlord: "Mall Management", phone: "+91 98765 43241", lat: 22.4678, lng: 88.3867 },
    
    // Behala Area
    { id: 27, title: "Workshop Space in Behala", type: "industrial", location: "Behala, Kolkata", price: 21000, size: 1800, description: "Automotive workshop ready, tools included", verified: false, landlord: "Workshop Owner", phone: "+91 98765 43242", lat: 22.4889, lng: 88.3156 },
    { id: 28, title: "Medical Center Space", type: "office", location: "Behala Chowrasta", price: 35000, size: 850, description: "Healthcare facility ready, parking", verified: true, landlord: "Healthcare Properties", phone: "+91 98765 43243", lat: 22.4867, lng: 88.3178 },
    
    // Tollygunge
    { id: 29, title: "Film Studio Space", type: "office", location: "Tollygunge, Kolkata", price: 65000, size: 2500, description: "Studio space, film industry hub", verified: true, landlord: "Film Studios Ltd", phone: "+91 98765 43244", lat: 22.4756, lng: 88.3511 },
    { id: 30, title: "Production House Office", type: "office", location: "Tollygunge Metro Area", price: 42000, size: 1200, description: "Creative space, editing rooms available", verified: true, landlord: "Creative Spaces", phone: "+91 98765 43245", lat: 22.4733, lng: 88.3489 }
];

// Initialize map
function initMap() {
    if (!document.getElementById('map')) return;

    // Center on Kolkata
    map = L.map('map').setView([22.5726, 88.3639], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add property markers
    addPropertyMarkers();
    
    // Add click handler for radius center
    map.on('click', function(e) {
        updateRadiusCenter(e.latlng);
    });

    // Initial radius circle at map center
    updateRadiusCenter(map.getCenter());
}

// Add property markers to map
function addPropertyMarkers() {
    clearMarkers();
    
    propertiesWithCoords.forEach(property => {
        const marker = L.marker([property.lat, property.lng])
            .bindPopup(createPropertyPopup(property))
            .addTo(map);
        
        markers.push(marker);
    });
    
    updatePropertyList(propertiesWithCoords);
}

// Create property popup content
function createPropertyPopup(property) {
    return `
        <div class="map-popup">
            <h4>${property.title}</h4>
            <div class="popup-price">₹${property.price.toLocaleString()}/month</div>
            <p><strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
            <p><strong>Size:</strong> ${property.size} sq ft</p>
            ${property.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
            <div style="margin-top: 10px;">
                <a href="property-details.html?id=${property.id}" class="btn-primary btn-small">View Details</a>
            </div>
        </div>
    `;
}

// Update radius circle
function updateRadius(radius) {
    currentRadius = parseFloat(radius);
    document.getElementById('radiusValue').textContent = radius;
    
    if (radiusCircle) {
        radiusCircle.setRadius(currentRadius * 1000); // Convert to meters
        filterPropertiesByRadius();
    }
}

// Update radius center
function updateRadiusCenter(latlng) {
    if (radiusCircle) {
        map.removeLayer(radiusCircle);
    }
    
    radiusCircle = L.circle(latlng, {
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        radius: currentRadius * 1000 // Convert to meters
    }).addTo(map);
    
    filterPropertiesByRadius();
}

// Filter properties by radius
function filterPropertiesByRadius() {
    if (!radiusCircle) return;
    
    const center = radiusCircle.getLatLng();
    const radiusInMeters = currentRadius * 1000;
    
    const filteredProperties = propertiesWithCoords.filter(property => {
        const distance = map.distance(center, [property.lat, property.lng]);
        return distance <= radiusInMeters;
    });
    
    // Apply other filters
    const finalProperties = applyFilters(filteredProperties);
    updatePropertyList(finalProperties);
    highlightMarkers(finalProperties);
}

// Apply additional filters
function applyFilters(properties) {
    const typeFilter = document.getElementById('mapPropertyType')?.value;
    const budgetFilter = document.getElementById('mapBudget')?.value;
    const searchFilter = document.getElementById('mapSearch')?.value.toLowerCase();
    
    return properties.filter(property => {
        const matchesType = !typeFilter || property.type === typeFilter;
        const matchesBudget = !budgetFilter || property.price <= parseInt(budgetFilter);
        const matchesSearch = !searchFilter || 
            property.title.toLowerCase().includes(searchFilter) ||
            property.location.toLowerCase().includes(searchFilter);
        
        return matchesType && matchesBudget && matchesSearch;
    });
}

// Highlight markers for filtered properties
function highlightMarkers(filteredProperties) {
    markers.forEach((marker, index) => {
        const property = propertiesWithCoords[index];
        const isVisible = filteredProperties.some(p => p.id === property.id);
        
        if (isVisible) {
            marker.setOpacity(1);
        } else {
            marker.setOpacity(0.3);
        }
    });
}

// Update property list in sidebar
function updatePropertyList(properties) {
    const container = document.getElementById('mapPropertyList');
    if (!container) return;
    
    if (properties.length === 0) {
        container.innerHTML = '<p class="no-results">No properties found in this area.</p>';
        return;
    }
    
    container.innerHTML = properties.map(property => `
        <div class="map-property-card" onclick="focusOnProperty(${property.id})">
            <h4>${property.title}</h4>
            <div class="property-price">₹${property.price.toLocaleString()}/month</div>
            <p class="property-location">${property.location}</p>
            <div class="property-meta">
                <span>${property.type}</span> • <span>${property.size} sq ft</span>
                ${property.verified ? ' • <span class="verified-badge">✓ Verified</span>' : ''}
            </div>
        </div>
    `).join('');
}

// Focus on specific property
function focusOnProperty(propertyId) {
    const property = propertiesWithCoords.find(p => p.id === propertyId);
    if (property) {
        map.setView([property.lat, property.lng], 15);
        
        // Find and open the marker popup
        const marker = markers.find((m, index) => 
            propertiesWithCoords[index].id === propertyId
        );
        if (marker) {
            marker.openPopup();
        }
    }
}

// Search on map with geocoding
function searchOnMap() {
    const searchTerm = document.getElementById('mapSearch').value.trim();
    
    if (searchTerm.length > 2) {
        geocodeLocation(searchTerm);
    } else {
        filterPropertiesByRadius();
    }
}

// Debounced search
let searchTimeout;
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchOnMap, 500);
}

// Geocode location using Nominatim API
function geocodeLocation(locationName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', Kolkata, West Bengal, India')}&limit=1`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                
                map.setView([lat, lng], 14);
                updateRadiusCenter(L.latLng(lat, lng));
                
                const searchMarker = L.marker([lat, lng], {
                    icon: L.icon({
                        iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="#ff4444" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/><circle fill="white" cx="12.5" cy="12.5" r="6"/></svg>`),
                        iconSize: [25, 41],
                        iconAnchor: [12, 41]
                    })
                }).addTo(map).bindPopup(`<b>Found:</b><br>${data[0].display_name}`).openPopup();
                
                setTimeout(() => map.removeLayer(searchMarker), 5000);
            } else {
                alert('Location not found. Try: Park Street, Salt Lake, New Town');
            }
        })
        .catch(() => filterPropertiesByRadius());
}

// Filter map properties
function filterMapProperties() {
    filterPropertiesByRadius();
}

// Clear all markers
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('map-view.html')) {
        initMap();
    }
});