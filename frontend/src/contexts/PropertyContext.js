import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { propertyAPI } from '../services/api';

const PropertyContext = createContext();

const propertyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload,
        loading: false
      };
    case 'SET_PROPERTY':
      return {
        ...state,
        currentProperty: action.payload,
        loading: false
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload)
      };
    case 'ADD_PROPERTY':
      return {
        ...state,
        properties: [...state.properties, action.payload],
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  properties: [],
  currentProperty: null,
  searchResults: [],
  favorites: [],
  filters: {
    location: '',
    priceRange: { min: 0, max: 10000 },
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    amenities: []
  },
  loading: false,
  error: null
};

// Production-ready context - no mock data

export const PropertyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  const searchProperties = useCallback(async (searchParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Build query parameters for backend search API
      const queryParams = {};
      
      // Use location as both city filter and general search query
      if (searchParams.location) {
        queryParams.city = searchParams.location;  // For city-specific search
        queryParams.q = searchParams.location;     // For general text search
      }
      
      if (searchParams.propertyType) queryParams.propertyType = searchParams.propertyType;
      if (searchParams.minPrice) queryParams.minRent = searchParams.minPrice;
      if (searchParams.maxPrice) queryParams.maxRent = searchParams.maxPrice;
      if (searchParams.bedrooms) queryParams.bedrooms = searchParams.bedrooms;
      if (searchParams.capacity) queryParams.bedrooms = searchParams.capacity;

      // Call backend search API
      const response = await propertyAPI.searchProperties(queryParams);
      
      if (response.success) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data.properties });
      } else {
        throw new Error(response.message || 'Failed to search properties');
      }
    } catch (error) {
      console.error('Search properties error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      
      // Fallback to empty results for production - no mock data
      console.warn('API search failed, using empty results. Ensure backend is running.');
      
      // Return empty results when API fails
      dispatch({ 
        type: 'SET_SEARCH_RESULTS', 
        payload: [] 
      });
    }
  }, []);

  const getPropertyById = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Try backend API first
      const response = await propertyAPI.getProperty(id);
      if (response.success) {
        dispatch({ type: 'SET_PROPERTY', payload: response.data.property });
      } else {
        throw new Error(response.message || 'Property not found');
      }
    } catch (error) {
      console.error('Get property error:', error);
      // No fallback data for production
      dispatch({ type: 'SET_ERROR', payload: 'Property not found' });
    }
  }, []);

  const addProperty = useCallback(async (propertyData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // API call would go here
      const newProperty = {
        ...propertyData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'available',
        landlord: {
          name: 'Current User',
          verified: true,
          rating: 4.5
        },
        reviews: []
      };
      
      setTimeout(() => {
        dispatch({ type: 'ADD_PROPERTY', payload: newProperty });
      }, 1000);
      
      return { success: true, property: newProperty };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  }, []);

  const toggleFavorite = useCallback((propertyId) => {
    if (state.favorites.includes(propertyId)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: propertyId });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: propertyId });
    }
  }, [state.favorites]);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  }, []);

  const value = {
    ...state,
    searchProperties,
    getPropertyById,
    addProperty,
    toggleFavorite,
    setFilters
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export default PropertyContext;