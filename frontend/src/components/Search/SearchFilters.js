import React, { useState, useEffect } from 'react';
import { useProperty } from '../../contexts/PropertyContext';

const SearchFilters = () => {
  const { filters, dispatch } = useProperty();
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local filters with context filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
    dispatch({ type: 'SET_FILTERS', payload: { [key]: value } });
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = {
      ...localFilters.priceRange,
      [type]: parseInt(value) || 0
    };
    setLocalFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }));
    dispatch({ type: 'SET_FILTERS', payload: { priceRange: newPriceRange } });
  };

  const clearFilters = () => {
    const defaultFilters = {
      location: '',
      priceRange: { min: 0, max: 10000 },
      propertyType: '',
      capacity: '',
      floorLevel: '',
      amenities: []
    };
    setLocalFilters(defaultFilters);
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
  };

  const amenitiesList = [
    'WiFi', 'Parking', 'Security System', 'Elevator', 'Generator/Power Backup',
    'CCTV Surveillance', 'Air Conditioning', 'Reception/Front Desk', 'Conference Room',
    'Hospital Nearby', 'ATM Access', 'Market/Shopping Area', 'Petrol Pump',
    'Public Transport', 'Restaurant/Food Court', 'Fire Safety System', 'Handicap Accessible',
    'Loading Dock', 'Storage Space', 'Natural Light', 'Ventilation System',
    'Cafeteria', 'Cleaning Service', '24/7 Access', 'Maintenance Service'
  ];

  const toggleAmenity = (amenity) => {
    const newAmenities = localFilters.amenities.includes(amenity)
      ? localFilters.amenities.filter(a => a !== amenity)
      : [...localFilters.amenities, amenity];
    
    setLocalFilters(prev => ({
      ...prev,
      amenities: newAmenities
    }));
    dispatch({ type: 'SET_FILTERS', payload: { amenities: newAmenities } });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.priceRange.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="input text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.priceRange.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="input text-sm"
            />
          </div>
          <div className="text-xs text-gray-500">
            ${localFilters.priceRange.min.toLocaleString()} - ${localFilters.priceRange.max.toLocaleString()}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Property Type
          </label>
          <div className="space-y-2">
            {['Retail', 'Industrial', 'Office Buildings', 'F&B Spaces', 'Warehousing & Storage', 'Wellness & Fitness Studios', 'Training & Coaching Center', 'Mixed-Use Commercial Floors', 'Studio & Creative Spaces', 'Diagnostic Centers', 'Spas & Wellness Retreats', 'Others/Custom'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="propertyType"
                  value={type.toLowerCase()}
                  checked={localFilters.propertyType === type.toLowerCase()}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Capacity (People)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['10', '25', '50', '100+'].map((cap) => (
              <button
                key={cap}
                onClick={() => handleFilterChange('capacity', cap === localFilters.capacity ? '' : cap)}
                className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                  localFilters.capacity === cap
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cap === '100+' ? '100+' : `${cap}`}
              </button>
            ))}
          </div>
        </div>

        {/* Floor Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Floor Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[{ key: 'ground', label: 'Ground' }, { key: 'upper', label: 'Upper' }, { key: 'top', label: 'Top' }].map((floor) => (
              <button
                key={floor.key}
                onClick={() => handleFilterChange('floorLevel', floor.key === localFilters.floorLevel ? '' : floor.key)}
                className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                  localFilters.floorLevel === floor.key
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {floor.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amenities
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  checked={localFilters.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;