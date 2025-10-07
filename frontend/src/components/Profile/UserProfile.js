import React, { useState, useEffect } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';

const UserProfile = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    profilePhoto: null,
    bio: '',
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    preferences: {
      propertyTypes: [],
      priceRange: { min: '', max: '' },
      locations: []
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    verifications: {
      email: false,
      phone: false,
      identity: false,
      address: false
    },
    stats: {
      propertiesListed: 0,
      propertiesRented: 0,
      reviewsReceived: 0,
      rating: 0
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        setUserProfile({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+91 9876543210',
          userType: 'tenant',
          profilePhoto: null,
          bio: 'Looking for a comfortable 2BHK apartment in Bangalore with good connectivity to tech parks.',
          location: {
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India'
          },
          preferences: {
            propertyTypes: ['Apartment', 'Villa'],
            priceRange: { min: '20000', max: '50000' },
            locations: ['Koramangala', 'HSR Layout', 'Indiranagar']
          },
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            twitter: '',
            facebook: '',
            instagram: ''
          },
          verifications: {
            email: true,
            phone: true,
            identity: false,
            address: false
          },
          stats: {
            propertiesListed: 0,
            propertiesRented: 2,
            reviewsReceived: 8,
            rating: 4.5
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUserProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePreferenceChange = (type, value) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value
      }
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setUserProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!userProfile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!userProfile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!userProfile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userProfile.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!userProfile.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpdate = (photoData) => {
    setUserProfile(prev => ({
      ...prev,
      profilePhoto: photoData
    }));
  };

  const getVerificationBadgeColor = (verified) => {
    return verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500';
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'settings', label: 'Account Settings', icon: '⚙️' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            {activeTab === 'profile' && (
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <ProfilePhotoUpload
                  currentPhoto={userProfile.profilePhoto}
                  onPhotoUpdate={handlePhotoUpdate}
                  isEditing={isEditing}
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.firstName}</p>
                    )}
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.lastName}</p>
                    )}
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{userProfile.email}</p>
                        {userProfile.verifications.email && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    )}
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{userProfile.phone}</p>
                        {userProfile.verifications.phone && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    )}
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Type
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      userProfile.userType === 'agent' ? 'bg-blue-100 text-blue-800' :
                      userProfile.userType === 'owner' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {userProfile.userType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Profile Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Properties Listed:</span>
                    <span className="font-medium">{userProfile.stats.propertiesListed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Properties Rented:</span>
                    <span className="font-medium">{userProfile.stats.propertiesRented}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reviews:</span>
                    <span className="font-medium">{userProfile.stats.reviewsReceived}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{userProfile.stats.rating}</span>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className={`w-3 h-3 ${star <= userProfile.stats.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={userProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us about yourself, your preferences, and what you're looking for..."
              />
            ) : (
              <p className="text-gray-700">{userProfile.bio || 'No bio added yet.'}</p>
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{userProfile.location.city || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.location.state}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{userProfile.location.state || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                {isEditing ? (
                  <select
                    value={userProfile.location.country}
                    onChange={(e) => handleInputChange('location.country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{userProfile.location.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(userProfile.socialLinks).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {platform}
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`https://${platform}.com/username`}
                    />
                  ) : (
                    <p className="text-gray-900">
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {url}
                        </a>
                      ) : (
                        'Not added'
                      )}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Verifications */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Verifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(userProfile.verifications).map(([type, verified]) => (
                <div key={type} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {type === 'email' && '📧'}
                      {type === 'phone' && '📱'}
                      {type === 'identity' && '🆔'}
                      {type === 'address' && '🏠'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {verified ? 'Verified and secure' : 'Click to verify'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVerificationBadgeColor(verified)}`}>
                      {verified ? 'Verified' : 'Pending'}
                    </span>
                    {!verified && (
                      <button className="ml-2 text-primary-600 hover:text-primary-700 text-sm">
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <AccountSettings userProfile={userProfile} onUpdate={setUserProfile} />
      )}

      {activeTab === 'notifications' && (
        <NotificationSettings userId={userId} />
      )}
    </div>
  );
};

export default UserProfile;