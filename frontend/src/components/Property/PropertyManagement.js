import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PropertyListingForm from './PropertyListingForm';
import PropertyPhotoUpload from './PropertyPhotoUpload';
import PropertySearchFilter from './PropertySearchFilter';
import PropertyBookingSystem from './PropertyBookingSystem';

const PropertyManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  // Sample data - replace with API calls
  useEffect(() => {
    loadProperties();
    loadInquiries();
    loadBookings();
    loadAnalytics();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    // Mock data - replace with actual API call
    const mockProperties = [
      {
        id: 1,
        title: '3 BHK Luxury Apartment',
        location: 'Koramangala, Bangalore',
        price: 45000,
        type: 'Apartment',
        status: 'Available',
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security'],
        description: 'Beautiful 3BHK apartment with modern amenities and great location.',
        views: 245,
        inquiries: 12,
        createdAt: '2024-09-15',
        owner: user?.id
      },
      {
        id: 2,
        title: '2 BHK Modern Flat',
        location: 'HSR Layout, Bangalore',
        price: 32000,
        type: 'Apartment',
        status: 'Rented',
        bedrooms: 2,
        bathrooms: 2,
        area: 950,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
        ],
        amenities: ['Parking', 'Balcony', 'Kitchen Appliances'],
        description: 'Cozy 2BHK flat perfect for small families or professionals.',
        views: 189,
        inquiries: 8,
        createdAt: '2024-09-10',
        owner: user?.id
      }
    ];
    setProperties(mockProperties);
    setLoading(false);
  };

  const loadInquiries = async () => {
    // Load inquiries from API - no mock data in production
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/inquiries/my-properties');
      // setInquiries(response.data.inquiries);
      setInquiries([]); // Empty until real API is connected
    } catch (error) {
      console.error('Error loading inquiries:', error);
      setInquiries([]);
    }
  };

  const loadBookings = async () => {
    // Load bookings from API - no mock data in production
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/bookings/my-properties');
      // setBookings(response.data.bookings);
      setBookings([]); // Empty until real API is connected
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    }
  };

  const loadAnalytics = async () => {
    // Load analytics from API - no mock data in production
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/analytics/property-summary');
      // setAnalytics(response.data.analytics);
      setAnalytics({
        totalProperties: 0,
        availableProperties: 0,
        rentedProperties: 0,
        totalInquiries: 0,
        newInquiries: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        averageRent: 0,
        occupancyRate: 0
      }); // Empty until real API is connected
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics({});
    }
  };

  const handleAddProperty = async (propertyData) => {
    try {
      setLoading(true);
      // API call to add property
      const newProperty = {
        ...propertyData,
        id: Date.now(),
        owner: user?.id,
        status: 'Available',
        views: 0,
        inquiries: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProperties(prev => [...prev, newProperty]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (propertyId, updates) => {
    try {
      setLoading(true);
      setProperties(prev => 
        prev.map(prop => 
          prop.id === propertyId ? { ...prop, ...updates } : prop
        )
      );
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        setLoading(true);
        setProperties(prev => prev.filter(prop => prop.id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Rented': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInquiryStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-green-100 text-green-800';
      case 'Contacted': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Converted': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
              <p className="text-gray-600">Manage your properties, track inquiries, and analyze performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Add New Property
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                📊 View Analytics
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-t border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'listings', name: 'My Properties', icon: '🏠' },
                { id: 'inquiries', name: 'Inquiries', icon: '💬' },
                { id: 'bookings', name: 'Bookings', icon: '📅' },
                { id: 'analytics', name: 'Analytics', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Properties Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏘️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalProperties}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.availableProperties}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rented</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.rentedProperties}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{analytics.monthlyRevenue?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search properties..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="border border-gray-300 rounded-lg px-3 py-2">
                    <option>All Status</option>
                    <option>Available</option>
                    <option>Rented</option>
                    <option>Maintenance</option>
                  </select>
                  
                  <select className="border border-gray-300 rounded-lg px-3 py-2">
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Villa</option>
                    <option>Studio</option>
                  </select>
                  
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                    🔽 Sort by: Date Added
                  </button>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                  {/* Property Image */}
                  <div className="relative h-48">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        ₹{property.price.toLocaleString()}/month
                      </span>
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{property.bedrooms} Bed</span>
                      <span>{property.bathrooms} Bath</span>
                      <span>{property.area} sq ft</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>👁️ {property.views} views</span>
                      <span>💬 {property.inquiries} inquiries</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="px-3 py-2 text-red-600 border border-red-200 rounded text-sm hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Property Inquiries</h2>
              <div className="flex space-x-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2">
                  <option>All Status</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Scheduled</option>
                  <option>Converted</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquirer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{inquiry.propertyTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{inquiry.inquirerName}</div>
                          <div className="text-sm text-gray-500">{inquiry.inquirerEmail}</div>
                          <div className="text-sm text-gray-500">{inquiry.inquirerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{inquiry.budget}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInquiryStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {inquiry.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">Reply</button>
                            <button className="text-green-600 hover:text-green-900">Schedule</button>
                            <button className="text-gray-600 hover:text-gray-900">Mark as Read</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Bookings</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.propertyTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.tenantName}</div>
                          <div className="text-sm text-gray-500">{booking.tenantEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.startDate} to {booking.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{booking.monthlyRent.toLocaleString()}/month
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View Contract</button>
                            <button className="text-green-600 hover:text-green-900">Payment History</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{analytics.occupancyRate}%</div>
                <div className="text-sm text-gray-600">Occupancy Rate</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-green-600">₹{analytics.averageRent?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Average Rent</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{analytics.totalInquiries}</div>
                <div className="text-sm text-gray-600">Total Inquiries</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">₹{analytics.totalRevenue?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">📊 Revenue Chart (Integration Needed)</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Property Performance</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">📈 Performance Chart (Integration Needed)</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Property Modal */}
      {showAddForm && (
        <PropertyListingForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddProperty}
          loading={loading}
        />
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedProperty.title}</h3>
                <p className="text-gray-600 mb-4">{selectedProperty.description}</p>
                <div className="space-y-2">
                  <p><strong>Location:</strong> {selectedProperty.location}</p>
                  <p><strong>Price:</strong> ₹{selectedProperty.price.toLocaleString()}/month</p>
                  <p><strong>Type:</strong> {selectedProperty.type}</p>
                  <p><strong>Area:</strong> {selectedProperty.area} sq ft</p>
                  <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;