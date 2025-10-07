import React, { useState } from 'react';
import PropertyPhotoUpload from './PropertyPhotoUpload';

const PropertyListingForm = ({ onClose, onSubmit, loading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Details
    title: '',
    description: '',
    propertyType: '',
    category: '',
    
    // Location
    address: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: null,
    
    // Specifications
    bedrooms: '',
    bathrooms: '',
    totalArea: '',
    carpetArea: '',
    floor: '',
    totalFloors: '',
    
    // Pricing
    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharges: '',
    brokerageType: 'no-brokerage',
    brokerageAmount: '',
    
    // Amenities
    amenities: [],
    
    // Images
    images: [],
    
    // Additional Details
    furnishing: '',
    parking: '',
    availableFrom: '',
    preferredTenants: [],
    
    // Rules
    petPolicy: '',
    smokingPolicy: '',
    guestsPolicy: '',
    
    // Contact
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    preferredCallTime: ''
  });
  
  const [errors, setErrors] = useState({});

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Studio', 'PG/Hostel', 
    'Commercial Office', 'Shop/Showroom', 'Warehouse'
  ];

  const categories = [
    'Residential', 'Commercial', 'Co-living', 'Student Housing'
  ];

  const amenitiesList = [
    'Air Conditioning', 'Balcony', 'CCTV Security', 'Club House',
    'Elevator', 'Furnished', 'Garden', 'Gym/Fitness Center',
    'Internet/WiFi', 'Kitchen Appliances', 'Laundry', 'Maid Service',
    'Parking', 'Power Backup', 'Security Guard', 'Swimming Pool',
    'Water Supply', 'Wheelchair Accessible'
  ];

  const furnishingOptions = [
    'Fully Furnished', 'Semi Furnished', 'Unfurnished'
  ];

  const tenantPreferences = [
    'Family', 'Students', 'Working Professionals', 'Bachelors', 'Anyone'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleTenantPreferenceToggle = (preference) => {
    setFormData(prev => ({
      ...prev,
      preferredTenants: prev.preferredTenants.includes(preference)
        ? prev.preferredTenants.filter(p => p !== preference)
        : [...prev.preferredTenants, preference]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
        break;
        
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.area.trim()) newErrors.area = 'Area is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        break;
        
      case 3:
        if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
        if (!formData.bathrooms) newErrors.bathrooms = 'Number of bathrooms is required';
        if (!formData.totalArea) newErrors.totalArea = 'Total area is required';
        break;
        
      case 4:
        if (!formData.monthlyRent) newErrors.monthlyRent = 'Monthly rent is required';
        if (!formData.securityDeposit) newErrors.securityDeposit = 'Security deposit is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      await onSubmit(formData);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 6 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Property Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., 3 BHK Apartment in Koramangala"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.propertyType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Property Type</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your property, its features, nearby facilities, etc."
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description.length}/2000 characters (minimum 50 required)
        </p>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complete Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter complete address with landmarks"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area/Locality *
          </label>
          <input
            type="text"
            value={formData.area}
            onChange={(e) => handleInputChange('area', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.area ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Koramangala, Indiranagar"
          />
          {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Bangalore"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Karnataka"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.pincode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="560001"
          />
          {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Specifications</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms *
          </label>
          <select
            value={formData.bedrooms}
            onChange={(e) => handleInputChange('bedrooms', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.bedrooms ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            {[0, 1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num === 0 ? 'Studio' : num}</option>
            ))}
          </select>
          {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms *
          </label>
          <select
            value={formData.bathrooms}
            onChange={(e) => handleInputChange('bathrooms', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.bathrooms ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Floor
          </label>
          <input
            type="number"
            value={formData.floor}
            onChange={(e) => handleInputChange('floor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Floor No."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Floors
          </label>
          <input
            type="number"
            value={formData.totalFloors}
            onChange={(e) => handleInputChange('totalFloors', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Total"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Area (sq ft) *
          </label>
          <input
            type="number"
            value={formData.totalArea}
            onChange={(e) => handleInputChange('totalArea', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.totalArea ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 1200"
          />
          {errors.totalArea && <p className="text-red-500 text-sm mt-1">{errors.totalArea}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carpet Area (sq ft)
          </label>
          <input
            type="number"
            value={formData.carpetArea}
            onChange={(e) => handleInputChange('carpetArea', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., 1000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing Status
        </label>
        <div className="grid grid-cols-3 gap-4">
          {furnishingOptions.map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="furnishing"
                value={option}
                checked={formData.furnishing === option}
                onChange={(e) => handleInputChange('furnishing', e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Rent (₹) *
          </label>
          <input
            type="number"
            value={formData.monthlyRent}
            onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.monthlyRent ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 25000"
          />
          {errors.monthlyRent && <p className="text-red-500 text-sm mt-1">{errors.monthlyRent}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Deposit (₹) *
          </label>
          <input
            type="number"
            value={formData.securityDeposit}
            onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.securityDeposit ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 50000"
          />
          {errors.securityDeposit && <p className="text-red-500 text-sm mt-1">{errors.securityDeposit}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maintenance Charges (₹/month)
        </label>
        <input
          type="number"
          value={formData.maintenanceCharges}
          onChange={(e) => handleInputChange('maintenanceCharges', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., 2000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brokerage
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="brokerageType"
              value="no-brokerage"
              checked={formData.brokerageType === 'no-brokerage'}
              onChange={(e) => handleInputChange('brokerageType', e.target.value)}
              className="mr-2"
            />
            No Brokerage
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="brokerageType"
              value="fixed"
              checked={formData.brokerageType === 'fixed'}
              onChange={(e) => handleInputChange('brokerageType', e.target.value)}
              className="mr-2"
            />
            Fixed Amount
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="brokerageType"
              value="percentage"
              checked={formData.brokerageType === 'percentage'}
              onChange={(e) => handleInputChange('brokerageType', e.target.value)}
              className="mr-2"
            />
            Percentage of Rent
          </label>
        </div>
        
        {formData.brokerageType !== 'no-brokerage' && (
          <input
            type="number"
            value={formData.brokerageAmount}
            onChange={(e) => handleInputChange('brokerageAmount', e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={formData.brokerageType === 'percentage' ? 'Percentage (e.g., 1)' : 'Amount (e.g., 5000)'}
          />
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Preferences</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Selected: {formData.amenities.length} amenities
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preferred Tenants
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {tenantPreferences.map(preference => (
            <label key={preference} className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.preferredTenants.includes(preference)}
                onChange={() => handleTenantPreferenceToggle(preference)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{preference}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parking
          </label>
          <select
            value={formData.parking}
            onChange={(e) => handleInputChange('parking', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select Parking</option>
            <option value="no-parking">No Parking</option>
            <option value="bike">Bike Parking</option>
            <option value="car">Car Parking</option>
            <option value="both">Both Bike & Car</option>
            <option value="multiple">Multiple Spaces</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available From
          </label>
          <input
            type="date"
            value={formData.availableFrom}
            onChange={(e) => handleInputChange('availableFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos & Contact Details</h3>
      
      <PropertyPhotoUpload
        images={formData.images}
        onImagesChange={(images) => handleInputChange('images', images)}
      />

      <div className="border-t pt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Property owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.ownerPhone}
              onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="owner@example.com"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Call Time
          </label>
          <select
            value={formData.preferredCallTime}
            onChange={(e) => handleInputChange('preferredCallTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Any time</option>
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 9 PM)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    const titles = {
      1: 'Basic Details',
      2: 'Location',
      3: 'Specifications',
      4: 'Pricing',
      5: 'Amenities',
      6: 'Photos & Contact'
    };
    return titles[currentStep];
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white mb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {renderStepIndicator()}

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Step {currentStep} of 6: {getStepTitle()}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="min-h-96">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t mt-6">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || loading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of 6
            </div>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Property...
                  </>
                ) : 'Create Property'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyListingForm;