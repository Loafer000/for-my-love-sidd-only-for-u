import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingAPI } from '../services/api';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's bookings
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      if (response.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Load bookings error:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Real data from API
  const [savedProperties] = useState([]);

  const applications = [
    {
      id: 1,
      property: 'Modern Downtown Apartment',
      status: 'Under Review',
      appliedDate: '2023-11-18',
      statusColor: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: 2,
      property: 'Luxury Condo with Ocean View',
      status: 'Approved',
      appliedDate: '2023-11-12',
      statusColor: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      property: 'Studio Apartment in Arts District',
      status: 'Rejected',
      appliedDate: '2023-11-08',
      statusColor: 'text-red-600 bg-red-100'
    }
  ];

  const recentViews = [
    {
      id: 1,
      title: 'Spacious Townhouse with Yard',
      location: 'Family Neighborhood, Westside',
      price: 2200,
      viewedDate: '2023-11-20'
    },
    {
      id: 2,
      title: 'Modern Loft Downtown',
      location: 'City Center, Business District',
      price: 2800,
      viewedDate: '2023-11-19'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your property search and applications</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Saved Properties</h3>
                <p className="text-2xl font-bold text-gray-900">{savedProperties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Bookings</h3>
                <p className="text-2xl font-bold text-gray-900">{bookings.filter(b => ['pending', 'approved', 'confirmed'].includes(b.status)).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Applications</h3>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Recently Viewed</h3>
                <p className="text-2xl font-bold text-gray-900">{recentViews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'saved'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Properties
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Applications
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recent'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recently Viewed
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">My Bookings & Inquiries</h3>
                  <button
                    onClick={loadBookings}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Refresh
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h4 className="text-xl font-medium text-gray-900 mb-2">No bookings yet</h4>
                    <p className="text-gray-600 mb-4">Start by searching for properties and making inquiries</p>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Search Properties
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{booking.property?.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.type === 'inquiry' ? 'bg-purple-100 text-purple-800' :
                                booking.type === 'booking' ? 'bg-indigo-100 text-indigo-800' :
                                'bg-cyan-100 text-cyan-800'
                              }`}>
                                {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">📍 {booking.property?.location}</p>
                            <p className="text-sm text-gray-500">
                              Submitted on {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            {booking.contact?.message && (
                              <p className="text-sm text-gray-700 mt-2 italic">"{booking.contact.message}"</p>
                            )}
                            {booking.visitSchedule && (
                              <div className="mt-2 text-sm text-indigo-600">
                                📅 Visit scheduled for {new Date(booking.visitSchedule.date).toLocaleDateString()} at {booking.visitSchedule.time}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              View Details
                            </button>
                            {booking.status === 'pending' && (
                              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <p className="text-lg font-bold text-primary-600">${property.price}/month</p>
                        <p className="text-xs text-gray-500 mt-2">Saved on {property.savedDate}</p>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700">
                            View Details
                          </button>
                          <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Applications</h3>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{application.property}</h4>
                          <p className="text-sm text-gray-600">Applied on {application.appliedDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${application.statusColor}`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="text-sm text-primary-600 hover:text-primary-800">View Application</button>
                        <button className="text-sm text-gray-600 hover:text-gray-800">Contact Landlord</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed Tab */}
            {activeTab === 'recent' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recently Viewed Properties</h3>
                <div className="space-y-4">
                  {recentViews.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{property.title}</h4>
                          <p className="text-sm text-gray-600">{property.location}</p>
                          <p className="text-lg font-bold text-primary-600">${property.price}/month</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Viewed on {property.viewedDate}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700">
                          View Again
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
                          Save Property
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Downtown, City Center"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white">
                      <option>$1000 - $1500</option>
                      <option>$1500 - $2000</option>
                      <option>$2000 - $2500</option>
                      <option>$2500 - $3000</option>
                      <option>$3000+</option>
                    </select>
                  </div>
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700">
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;