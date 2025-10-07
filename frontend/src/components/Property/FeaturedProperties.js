import React from 'react';
import PropertyCard from './PropertyCard';

const FeaturedProperties = ({ properties = [] }) => {
  // Real featured properties passed as props or from API
  // Use real properties from API, fallback to empty array
  const featuredProperties = properties || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredProperties.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <p className="text-lg">No featured properties available at the moment.</p>
          <p className="text-sm">Check back later for exciting new listings!</p>
        </div>
      ) : featuredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default FeaturedProperties;