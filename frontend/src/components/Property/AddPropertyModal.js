import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useProperty } from '../../contexts/PropertyContext';
import toast from 'react-hot-toast';

// Validation schemas for each step
const step1Schema = yup.object({
  title: yup.string().required('Property name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  pincode: yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
});

const step2Schema = yup.object({
  area: yup.number().min(1, 'Area must be at least 1 sq ft').required('Area is required'),
  price: yup.number().min(1, 'Monthly rent must be at least $1').required('Monthly rent is required'),
  bedrooms: yup.number().min(0, 'Bedrooms cannot be negative'),
  bathrooms: yup.number().min(0, 'Bathrooms cannot be negative'),
});

const step3Schema = yup.object({
  description: yup.string().min(50, 'Description must be at least 50 characters').required('Description is required'),
});

const AddPropertyModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [usagePreferences, setUsagePreferences] = useState([]);
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [hasOthersCustom, setHasOthersCustom] = useState(false);
  const { addProperty, loading } = useProperty();

  const getSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      default: return yup.object({});
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(getSchema()),
    defaultValues: formData,
  });

  const popularAmenities = [
    'WiFi', 'Parking', 'Security System', 'Elevator', 'Generator/Power Backup',
    'Water Supply', 'CCTV Surveillance', 'Reception/Front Desk', 'Conference Room',
    'Air Conditioning', 'Heating', 'Fire Safety System', 'Handicap Accessible',
    'Hospital Nearby', 'ATM Access', 'Market/Shopping Area', 'Petrol Pump',
    'Public Transport', 'Restaurant/Food Court', 'Loading Dock', 'Storage Space',
    'Natural Light', 'Ventilation System', 'Cafeteria', 'Cleaning Service',
    '24/7 Access', 'Maintenance Service', 'Washrooms', 'Kitchen/Pantry'
  ];

  const handleNext = (data) => {
    // Validate usage preferences on step 1
    if (currentStep === 1 && usagePreferences.length === 0) {
      toast.error('Please select at least one preferred business type');
      return;
    }
    
    setFormData(prev => ({ ...prev, ...data }));
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      reset(); // Reset form for next step
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      reset(formData); // Restore previous data
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);
  };

  const toggleAmenity = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleFinalSubmit = async (data) => {
    const finalData = {
      ...formData,
      ...data,
      amenities,
      usagePreferences,
      customBusinessType: hasOthersCustom ? customBusinessType : null,
      documents: documents.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      location: `${formData.address}, ${formData.city}, ${formData.pincode}`,
      images: [], // Real images will be uploaded
    };

    try {
      const result = await addProperty(finalData);
      if (result.success) {
        toast.success('Property added successfully!');
        onClose();
        resetForm();
      } else {
        toast.error('Failed to add property. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({});
    setDocuments([]);
    setAmenities([]);
    setUsagePreferences([]);
    setCustomBusinessType('');
    setHasOthersCustom(false);
    reset();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Name/Title *
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="e.g., Modern Office Space in Business District"
          className="input"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Property Types & Business Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Business Types (What kind of businesses do you want to rent to?) *
        </label>
        <div className="space-y-2">
          {/* Anyone/No Preferences Option - TOP OF LIST */}
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              checked={usagePreferences.includes('Anyone (No Preferences)')}
              onChange={() => {
                const anyoneOption = 'Anyone (No Preferences)';
                setUsagePreferences(prev => 
                  prev.includes(anyoneOption)
                    ? prev.filter(u => u !== anyoneOption)
                    : [...prev, anyoneOption]
                );
              }}
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">Anyone (No Preferences)</span>
          </label>
          
          {/* Separator line for visual clarity */}
          <div className="border-t border-gray-200 my-2"></div>
          
          {[
            'Retail',
            'Industrial', 
            'Office Buildings',
            'F&B Spaces (Food & Beverage)',
            'Warehousing & Storage',
            'Wellness & Fitness Studios',
            'Training & Coaching Center',
            'Mixed-Use Commercial Floors',
            'Studio & Creative Spaces',
            'Diagnostic Centers',
            'Spas & Wellness Retreats',
            'Office & Corporate',
            'Healthcare & Medical',
            'Education & Training',
            'Fitness & Wellness',
            'Creative & Studios',
            'Technology & IT',
            'Manufacturing & Industrial'
          ].map((usage) => (
            <label key={usage} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                checked={usagePreferences.includes(usage)}
                onChange={() => {
                  setUsagePreferences(prev => 
                    prev.includes(usage)
                      ? prev.filter(u => u !== usage)
                      : [...prev, usage]
                  );
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{usage}</span>
            </label>
          ))}
          
          {/* Others/Custom Option */}
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              checked={hasOthersCustom}
              onChange={() => {
                setHasOthersCustom(!hasOthersCustom);
                if (hasOthersCustom) {
                  setCustomBusinessType('');
                  setUsagePreferences(prev => prev.filter(u => !u.startsWith('Others/Custom:')));
                }
              }}
            />
            <span className="ml-2 text-sm text-gray-700">Others/Custom</span>
          </label>
          
          {/* Custom Business Type Input */}
          {hasOthersCustom && (
            <div className="ml-6 mt-2">
              <input
                type="text"
                className="input"
                placeholder="e.g., Coworking Space, Event Venue, etc."
                value={customBusinessType}
                onChange={(e) => {
                  setCustomBusinessType(e.target.value);
                  const customValue = `Others/Custom: ${e.target.value}`;
                  setUsagePreferences(prev => {
                    const filtered = prev.filter(u => !u.startsWith('Others/Custom:'));
                    return e.target.value ? [...filtered, customValue] : filtered;
                  });
                }}
              />
            </div>
          )}
        </div>
        {usagePreferences.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">Please select at least one preferred business type</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <input
          {...register('address')}
          type="text"
          placeholder="Street address, building name, floor"
          className="input"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            {...register('city')}
            type="text"
            placeholder="City name"
            className="input"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            {...register('pincode')}
            type="text"
            placeholder="6-digit pincode"
            className="input"
          />
          {errors.pincode && (
            <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Specifications</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size (sq. ft.) *
          </label>
          <input
            {...register('area', { valueAsNumber: true })}
            type="number"
            placeholder="e.g., 1200"
            className="input"
          />
          {errors.area && (
            <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Rent ($) *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            placeholder="e.g., 2500"
            className="input"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Floors
          </label>
          <input
            {...register('floors', { valueAsNumber: true })}
            type="number"
            placeholder="Number of floors"
            className="input"
            min="1"
            defaultValue="1"
          />
          {errors.floors && (
            <p className="mt-1 text-sm text-red-600">{errors.floors.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parking Spaces
          </label>
          <input
            {...register('parkingSpaces', { valueAsNumber: true })}
            type="number"
            placeholder="Number of parking spaces"
            className="input"
            min="0"
            defaultValue="0"
          />
          {errors.parkingSpaces && (
            <p className="mt-1 text-sm text-red-600">{errors.parkingSpaces.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Description & Amenities</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Description *
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Provide a detailed description of your property, including key features, location benefits, and any special characteristics..."
          className="input"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Minimum 50 characters required</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities & Features
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {popularAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Selected amenities: {amenities.length}
        </p>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload Required Documents *
              </span>
              <p className="text-xs text-gray-500">Sale Deed, Property Tax Receipt, etc.</p>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, or image files up to 10MB each
          </p>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="space-y-1">
            {documents.map((file, index) => (
              <li key={index} className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <span>{file.name}</span>
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>Document Verification:</strong> All uploaded documents will be manually verified by our team within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-12 h-1 mx-2 ${
                  step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(currentStep === 4 ? handleFinalSubmit : handleNext)}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (currentStep === 4 && documents.length === 0)}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : currentStep === 4 ? 'Submit Property' : 'Next'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;