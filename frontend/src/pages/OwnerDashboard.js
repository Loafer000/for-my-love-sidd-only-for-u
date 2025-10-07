import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import AddPropertyModal from '../components/Property/AddPropertyModal';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  // Check URL parameters for auto-opening Add Property modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setIsAddPropertyModalOpen(true);
    }
  }, [searchParams]);

  // Real data from API
  const [myProperties] = useState([]);

  const applications = [
    {
      id: 1,
      applicantName: 'Sarah Johnson',
      propertyTitle: 'Modern Downtown Apartment',
      applicationDate: '2023-11-18',
      status: 'Under Review',
      statusColor: 'text-yellow-600 bg-yellow-100',
      applicantEmail: 'sarah.j@email.com',
      applicantPhone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      applicantName: 'Michael Chen',
      propertyTitle: 'Modern Downtown Apartment',
      applicationDate: '2023-11-17',
      status: 'Approved',
      statusColor: 'text-green-600 bg-green-100',
      applicantEmail: 'michael.c@email.com',
      applicantPhone: '+1 (555) 987-6543'
    },
    {
      id: 3,
      applicantName: 'David Wilson',
      propertyTitle: 'Cozy Suburban House',
      applicationDate: '2023-11-16',
      status: 'Rejected',
      statusColor: 'text-red-600 bg-red-100',
      applicantEmail: 'david.w@email.com',
      applicantPhone: '+1 (555) 456-7890'
    }
  ];

  const earnings = [
    { month: 'November 2023', amount: 2500, property: 'Cozy Suburban House' },
    { month: 'October 2023', amount: 2500, property: 'Cozy Suburban House' },
    { month: 'September 2023', amount: 2500, property: 'Cozy Suburban House' }
  ];

  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your properties and tenant applications</p>
          </div>
          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Property
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">My Properties</h3>
                <p className="text-2xl font-bold text-gray-900">{myProperties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Monthly Earnings</h3>
                <p className="text-2xl font-bold text-gray-900">${earnings[0]?.amount || 0}</p>
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
                <h3 className="text-sm font-medium text-gray-500">New Applications</h3>
                <p className="text-2xl font-bold text-gray-900">{applications.filter(app => app.status === 'Under Review').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                <p className="text-2xl font-bold text-gray-900">{myProperties.reduce((sum, prop) => sum + prop.views, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Properties
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'earnings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Earnings
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
            {/* My Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">My Properties</h3>
                  <button
                    onClick={() => setIsAddPropertyModalOpen(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700"
                  >
                    Add Property
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProperties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{property.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.status === 'Available' ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                        <p className="text-lg font-bold text-primary-600 mb-3">${property.price}/month</p>
                        
                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <span>{property.applications} applications</span>
                          <span>{property.views} views</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200">
                            Edit
                          </button>
                          <button className="flex-1 border border-primary-600 text-primary-600 px-3 py-2 rounded-md text-sm hover:bg-primary-50">
                            View
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rental Applications</h3>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{application.applicantName}</h4>
                          <p className="text-sm text-gray-600">{application.propertyTitle}</p>
                          <p className="text-sm text-gray-500">Applied on {application.applicationDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${application.statusColor}`}>
                          {application.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Email: </span>
                          <span className="text-gray-900">{application.applicantEmail}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Phone: </span>
                          <span className="text-gray-900">{application.applicantPhone}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                          Reject
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
                          View Details
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Earnings Overview</h3>
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
                    <h4 className="text-lg font-medium mb-2">Total Earnings (Last 3 Months)</h4>
                    <p className="text-3xl font-bold">${totalEarnings}</p>
                  </div>
                </div>
                
                <h4 className="text-md font-medium text-gray-900 mb-4">Monthly Breakdown</h4>
                <div className="space-y-4">
                  {earnings.map((earning, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-gray-900">{earning.month}</h5>
                          <p className="text-sm text-gray-600">{earning.property}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${earning.amount}</p>
                          <p className="text-sm text-gray-500">Paid</p>
                        </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business License</label>
                    <input
                      type="text"
                      placeholder="Enter your business license number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
                    <input
                      type="text"
                      placeholder="Bank account for rent payments"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                    />
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

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
      />
    </div>
  );
};

export default OwnerDashboard;