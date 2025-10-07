import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  location: yup.string().required('Location is required'),
  propertyType: yup.string(),
  minPrice: yup.number().min(0, 'Minimum price must be at least 0'),
  maxPrice: yup.number().min(0, 'Maximum price must be at least 0'),
  capacity: yup.string(),
});

const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
    },
  });

  const onSubmit = (data) => {
    // Create search parameters
    const params = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    // Navigate to search results
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`backdrop-blur-xl bg-white/90 border border-white/20 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 ${className}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Location Input */}
          <div className="flex-1 group">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              📍 Location
            </label>
            <div className="relative">
              <input
                {...register('location')}
                type="text"
                placeholder="Enter city, neighborhood, or address"
                className="w-full px-5 py-4 pl-12 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 group-hover:border-indigo-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            {errors.location && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Property Type */}
          <div className="lg:w-64 group">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              🏢 Property Type
            </label>
            <div className="relative">
              <select {...register('propertyType')} className="w-full px-5 py-4 bg-white/80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-800 group-hover:border-indigo-300 appearance-none cursor-pointer">
                <option value="">Any Type</option>
                <option value="retail">🛍️ Retail</option>
                <option value="industrial">🏭 Industrial</option>
                <option value="office buildings">🏢 Office Buildings</option>
                <option value="f&b spaces">🍽️ F&B Spaces</option>
                <option value="warehousing & storage">📦 Warehousing & Storage</option>
                <option value="wellness & fitness studios">💪 Wellness & Fitness Studios</option>
                <option value="training & coaching center">🎓 Training & Coaching Center</option>
                <option value="mixed-use commercial floors">🏗️ Mixed-Use Commercial</option>
                <option value="studio & creative spaces">🎨 Studio & Creative Spaces</option>
                <option value="diagnostic centers">🏥 Diagnostic Centers</option>
                <option value="spas & wellness retreats">🧘 Spas & Wellness Retreats</option>
                <option value="others/custom">✨ Others/Custom</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 w-full lg:w-auto"
            >
              <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Properties</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            Advanced Filters
            <svg 
              className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    {...register('minPrice')}
                    type="number"
                    placeholder="Min Price"
                    className="input text-sm"
                  />
                  <input
                    {...register('maxPrice')}
                    type="number"
                    placeholder="Max Price"
                    className="input text-sm"
                  />
                </div>
                {(errors.minPrice || errors.maxPrice) && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.minPrice?.message || errors.maxPrice?.message}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (People)
                </label>
                <select {...register('capacity')} className="input">
                  <option value="">Any</option>
                  <option value="10">Up to 10 people</option>
                  <option value="25">Up to 25 people</option>
                  <option value="50">Up to 50 people</option>
                  <option value="100">Up to 100 people</option>
                  <option value="200">200+ people</option>
                </select>
              </div>

              {/* Floor Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Preference
                </label>
                <select {...register('floorPreference')} className="input">
                  <option value="">Any Floor</option>
                  <option value="ground">Ground Floor</option>
                  <option value="upper">Upper Floors</option>
                  <option value="top">Top Floor</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;