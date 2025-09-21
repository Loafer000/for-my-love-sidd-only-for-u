// Modern Property Details - Enhanced User Experience
const API_BASE = CONFIG?.API_BASE || 'http://localhost:3000/api';

// Demo property images
const demoImages = [
    'https://via.placeholder.com/800x500/E5E7EB/6B7280?text=Property+Main+View',
    'https://via.placeholder.com/800x500/F3F4F6/6B7280?text=Interior+View+1',
    'https://via.placeholder.com/800x500/F9FAFB/6B7280?text=Interior+View+2',
    'https://via.placeholder.com/800x500/E5E7EB/6B7280?text=Exterior+View',
    'https://via.placeholder.com/800x500/F3F4F6/6B7280?text=Amenities',
    'https://via.placeholder.com/800x500/F9FAFB/6B7280?text=Floor+Plan'
];

let currentImageIndex = 0;

// Load property details on page load
document.addEventListener('DOMContentLoaded', initializePropertyDetails);

function initializePropertyDetails() {
    loadPropertyDetails();
    initializeGallery();
    loadSimilarProperties();
}

function loadPropertyDetails() {
    // Demo property data (replace with real API call)
    const property = {
        id: 1,
        title: 'Modern Office Space in Salt Lake',
        price: '45,000',
        location: 'Salt Lake City, Sector 5, Kolkata',
        size: '1200',
        type: 'Office',
        description: 'This modern office space is perfect for startups and small businesses looking for a professional environment. Located in the heart of Salt Lake City, it offers excellent connectivity and modern amenities. The space features large windows, modern lighting, and flexible layout options.',
        verified: true,
        landlord: {
            name: 'Rajesh Kumar',
            rating: 4.2,
            reviews: 15,
            properties: 8,
            joinYear: 2020,
            avatar: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=RK'
        }
    };
    
    displayProperty(property);
}

function displayProperty(property) {
    // Update breadcrumb
    document.getElementById('breadcrumbTitle').textContent = property.title;
    
    // Update property details
    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('propertyLocation').textContent = property.location;
    document.getElementById('propertyPrice').textContent = `₹${property.price}`;
    document.getElementById('propertySize').textContent = property.size;
    document.getElementById('propertyType').textContent = property.type;
    document.getElementById('propertyDescription').textContent = property.description;
    
    // Show verified badge
    const verifiedBadge = document.getElementById('verifiedBadge');
    if (property.verified && verifiedBadge) {
        verifiedBadge.style.display = 'inline-flex';
    }
    
    // Update landlord info if elements exist
    const landlordElements = {
        name: document.querySelector('.landlord-name'),
        rating: document.querySelector('.rating-text'),
        avatar: document.querySelector('.landlord-avatar'),
        stats: document.querySelector('.landlord-stats')
    };
    
    if (landlordElements.name) landlordElements.name.textContent = property.landlord.name;
    if (landlordElements.rating) landlordElements.rating.textContent = `${property.landlord.rating} (${property.landlord.reviews} reviews)`;
    if (landlordElements.avatar) landlordElements.avatar.src = property.landlord.avatar;
    if (landlordElements.stats) {
        landlordElements.stats.innerHTML = `
            <span><i class="fas fa-building"></i> ${property.landlord.properties} Properties</span>
            <span><i class="fas fa-clock"></i> Joined ${property.landlord.joinYear}</span>
        `;
    }
}

function initializeGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailGrid = document.getElementById('thumbnailGrid');
    const totalImagesEl = document.getElementById('totalImages');
    const currentImageEl = document.getElementById('currentImage');
    
    if (!mainImage || !thumbnailGrid) return;
    
    // Set initial image
    mainImage.src = demoImages[0];
    
    // Update image count
    if (totalImagesEl) totalImagesEl.textContent = demoImages.length;
    if (currentImageEl) currentImageEl.textContent = '1';
    
    // Create thumbnails
    thumbnailGrid.innerHTML = demoImages.map((image, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${image}" alt="Property image ${index + 1}">
        </div>
    `).join('');
}

function selectImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    const currentImageEl = document.getElementById('currentImage');
    
    if (mainImage) mainImage.src = demoImages[index];
    if (currentImageEl) currentImageEl.textContent = index + 1;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function previousImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : demoImages.length - 1;
    selectImage(currentImageIndex);
}

function nextImage() {
    currentImageIndex = currentImageIndex < demoImages.length - 1 ? currentImageIndex + 1 : 0;
    selectImage(currentImageIndex);
}

function openFullscreen() {
    const mainImage = document.getElementById('mainImage');
    if (mainImage.requestFullscreen) {
        mainImage.requestFullscreen();
    } else if (mainImage.webkitRequestFullscreen) {
        mainImage.webkitRequestFullscreen();
    } else if (mainImage.msRequestFullscreen) {
        mainImage.msRequestFullscreen();
    }
}

function loadSimilarProperties() {
    const similarContainer = document.getElementById('similarProperties');
    if (!similarContainer) return;
    
    const similarProps = [
        {
            title: 'Luxury Apartment in Park Street',
            price: '₹35,000/month',
            image: 'https://via.placeholder.com/80x60/E5E7EB/6B7280?text=Apt'
        },
        {
            title: 'Coworking Space in New Town',
            price: '₹25,000/month',
            image: 'https://via.placeholder.com/80x60/F3F4F6/6B7280?text=Co-work'
        },
        {
            title: 'Studio Space in Ballygunge',
            price: '₹30,000/month',
            image: 'https://via.placeholder.com/80x60/F9FAFB/6B7280?text=Studio'
        }
    ];
    
    similarContainer.innerHTML = similarProps.map(prop => `
        <a href="#" class="similar-property" onclick="viewSimilarProperty('${prop.title}')">
            <div class="similar-image">
                <img src="${prop.image}" alt="${prop.title}">
            </div>
            <div class="similar-info">
                <h4>${prop.title}</h4>
                <div class="similar-price">${prop.price}</div>
            </div>
        </a>
    `).join('');
}

// Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Contact Form Submission
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const inquiryData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert(`Thank you ${inquiryData.name}! Your message has been sent to the landlord. They will contact you soon at ${inquiryData.email} or ${inquiryData.phone}.`);
        
        // Reset form and close modal
        event.target.reset();
        closeContactModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Action Functions
function scheduleVisit() {
    const visitDate = prompt('Preferred visit date (YYYY-MM-DD):');
    if (visitDate) {
        alert(`Visit scheduled for ${visitDate}! The landlord will confirm this shortly.`);
    }
}

function shareProperty() {
    if (navigator.share) {
        navigator.share({
            title: document.getElementById('propertyTitle').textContent,
            text: 'Check out this amazing property!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Property link copied to clipboard!');
        });
    }
}

function toggleFavorite() {
    const btn = document.querySelector('.favorite-btn');
    const icon = btn.querySelector('i');
    
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        alert('Property saved to favorites!');
    } else {
        icon.className = 'far fa-heart';
        alert('Property removed from favorites.');
    }
}

function callLandlord() {
    alert('Calling landlord... This would open the phone dialer with the landlord\'s number.');
}

function viewSimilarProperty(title) {
    alert(`Viewing similar property: ${title}`);
}

function loadMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="height: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Interactive map would load here with Google Maps or similar service</p>
                </div>
            </div>
        `;
    }
}

function downloadBrochure() {
    alert('Downloading property brochure... This would generate and download a PDF.');
}

function reportProperty() {
    const reason = prompt('Please specify the reason for reporting this property:');
    if (reason) {
        alert('Thank you for your report. We will investigate this property listing.');
    }
}

function printDetails() {
    window.print();
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) {
        closeContactModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('contactModal');
    if (modal && modal.classList.contains('active') && e.key === 'Escape') {
        closeContactModal();
    }
    
    // Gallery navigation
    if (e.key === 'ArrowLeft') {
        previousImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});