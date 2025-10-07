import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty } from '../contexts/PropertyContext';
import SearchBar from '../components/Search/SearchBar';
import PropertyCard from '../components/Property/PropertyCard';
import SearchFilters from '../components/Search/SearchFilters';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import MapView from '../components/Map/MapView';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { searchResults, loading, searchProperties, filters } = useProperty();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    // Get search parameters from URL
    const searchQuery = {
      location: searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || searchParams.get('type') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      capacity: searchParams.get('capacity') || '',
      floorPreference: searchParams.get('floorPreference') || ''
    };

    // Trigger search
    searchProperties(searchQuery);
  }, [searchParams, searchProperties]);

  const handleSortChange = (value) => {
    setSortBy(value);
    // Implement sorting logic here
  };

  const sortedResults = useMemo(() => {
    return [...searchResults].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });
  }, [searchResults, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Search Header */}
      <div className="backdrop-blur-xl bg-white/80 shadow-2xl border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🔍 Property Search
            </h1>
            <p className="text-gray-600">Find the perfect commercial space for your business</p>
          </div>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <SearchFilters />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h1>
                <p className="text-gray-600 mt-1">
                  {searchResults.length} properties found
                  {filters.location && ` in ${filters.location}`}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewMode === 'map'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Map
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Results Content */}
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {sortedResults.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sortedResults.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                    
                    {/* Pagination would go here */}
                    <div className="flex justify-center mt-8">
                      <div className="flex space-x-2">
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Previous
                        </button>
                        <button className="px-3 py-2 bg-primary-500 text-white rounded-lg">
                          1
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          2
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          3
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search criteria or filters
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="btn btn-primary"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <MapView properties={sortedResults} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;