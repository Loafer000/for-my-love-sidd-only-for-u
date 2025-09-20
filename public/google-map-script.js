// Free Google-style Maps functionality using Leaflet
let freeMap;
let freeMarkers = [];
let freeRadiusCircle;
let freeCurrentRadius = 2; // km

// Check if properties data exists, if not use from map-script.js
if (typeof propertiesWithCoords === 'undefined') {
    // Load properties from the other script or define here
    console.log('Loading properties for Google Maps...');
}

// Initialize Free Google-style Map
function initFreeGoogleMap() {
    // Center on Kolkata
    freeMap = L.map('googleMap').setView([22.5726, 88.3639], 12);

    // Add Google-style tile layer (free alternative)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(freeMap);

    // Add property markers
    addFreeGooglePropertyMarkers();
    
    // Add click handler for radius center
    freeMap.on('click', function(e) {
        updateFreeGoogleRadiusCenter(e.latlng);
    });

    // Initial radius circle
    updateFreeGoogleRadiusCenter(freeMap.getCenter());
}

// Add property markers to Free Map
function addFreeGooglePropertyMarkers() {
    clearFreeGoogleMarkers();
    
    propertiesWithCoords.forEach(property => {
        const marker = L.marker([property.lat, property.lng], {
            icon: L.divIcon({
                html: getFreePropertyIcon(property.type),
                className: 'custom-div-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).bindPopup(createFreeGooglePropertyPopup(property)).addTo(freeMap);
        
        freeMarkers.push(marker);
    });
    
    updateFreeGooglePropertyList(propertiesWithCoords);
}

// Get property icon based on type (Free version)
function getFreePropertyIcon(type) {
    const colors = {
        office: '#2563eb',
        retail: '#10b981', 
        industrial: '#f59e0b'
    };
    const letters = {
        office: 'O',
        retail: 'R',
        industrial: 'I'
    };
    const color = colors[type] || colors.office;
    const letter = letters[type] || letters.office;
    
    return `<div style="background: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${letter}</div>`;
}

// Create property popup content for Free Maps
function createFreeGooglePropertyPopup(property) {
    return `
        <div class="free-map-popup">
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

// Update radius circle for Free Maps
function updateGoogleRadius(radius) {
    freeCurrentRadius = parseFloat(radius);
    document.getElementById('googleRadiusValue').textContent = radius;
    
    if (freeRadiusCircle) {
        freeRadiusCircle.setRadius(freeCurrentRadius * 1000);
        filterFreeGooglePropertiesByRadius();
    }
}

// Update radius center for Free Maps
function updateFreeGoogleRadiusCenter(latlng) {
    if (freeRadiusCircle) {
        freeMap.removeLayer(freeRadiusCircle);
    }
    
    freeRadiusCircle = L.circle(latlng, {
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        radius: freeCurrentRadius * 1000
    }).addTo(freeMap);
    
    filterFreeGooglePropertiesByRadius();
}

// Filter properties by radius for Free Maps
function filterFreeGooglePropertiesByRadius() {
    if (!freeRadiusCircle) return;
    
    const center = freeRadiusCircle.getLatLng();
    const radiusInMeters = freeCurrentRadius * 1000;
    
    const filteredProperties = propertiesWithCoords.filter(property => {
        const distance = freeMap.distance(center, [property.lat, property.lng]);
        return distance <= radiusInMeters;
    });
    
    const finalProperties = applyFreeGoogleFilters(filteredProperties);
    updateFreeGooglePropertyList(finalProperties);
    highlightFreeGoogleMarkers(finalProperties);
}

// Apply additional filters for Free Maps
function applyFreeGoogleFilters(properties) {
    const typeFilter = document.getElementById('googleMapPropertyType')?.value;
    const budgetFilter = document.getElementById('googleMapBudget')?.value;
    const searchFilter = document.getElementById('googleMapSearch')?.value.toLowerCase();
    
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
function highlightFreeGoogleMarkers(filteredProperties) {
    freeMarkers.forEach((marker, index) => {
        const property = propertiesWithCoords[index];
        const isVisible = filteredProperties.some(p => p.id === property.id);
        
        marker.setOpacity(isVisible ? 1 : 0.3);
    });
}

// Update property list in sidebar for Free Maps
function updateFreeGooglePropertyList(properties) {
    const container = document.getElementById('googleMapPropertyList');
    if (!container) return;
    
    if (properties.length === 0) {
        container.innerHTML = '<p class="no-results">No properties found in this area.</p>';
        return;
    }
    
    container.innerHTML = properties.map(property => `
        <div class="map-property-card" onclick="focusOnFreeGoogleProperty(${property.id})">
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

// Focus on specific property for Free Maps
function focusOnFreeGoogleProperty(propertyId) {
    const property = propertiesWithCoords.find(p => p.id === propertyId);
    if (property) {
        freeMap.setView([property.lat, property.lng], 15);
        
        const marker = freeMarkers.find((m, index) => 
            propertiesWithCoords[index].id === propertyId
        );
        if (marker) {
            marker.openPopup();
        }
    }
}

// Search on Free Map
function searchGoogleMap() {
    const searchTerm = document.getElementById('googleMapSearch').value.trim();
    
    if (searchTerm.length > 2) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm + ', Kolkata, West Bengal, India')}&limit=1`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lng = parseFloat(data[0].lon);
                    
                    freeMap.setView([lat, lng], 14);
                    updateFreeGoogleRadiusCenter(L.latLng(lat, lng));
                    
                    const searchMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            html: '<div style="background: #ff4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
                            className: 'custom-div-icon',
                            iconSize: [30, 30],
                            iconAnchor: [15, 15]
                        })
                    }).addTo(freeMap).bindPopup(`<b>Found:</b><br>${data[0].display_name}`).openPopup();
                    
                    setTimeout(() => freeMap.removeLayer(searchMarker), 5000);
                } else {
                    alert('Location not found. Try: Park Street, Salt Lake, New Town');
                }
            })
            .catch(() => filterFreeGooglePropertiesByRadius());
    } else {
        filterFreeGooglePropertiesByRadius();
    }
}

// Filter Free Map properties
function filterGoogleMapProperties() {
    filterFreeGooglePropertiesByRadius();
}

// Clear all Free markers
function clearFreeGoogleMarkers() {
    freeMarkers.forEach(marker => freeMap.removeLayer(marker));
    freeMarkers = [];
}