import React, { useState } from 'react';
import { UserProfile, ProfilePhotoUpload, AccountSettings, NotificationSettings } from './Profile';

// Example integration component showing how to use the Profile components
const ProfilePage = () => {
  const [currentUser] = useState({
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <UserProfile userId={currentUser.id} />
      </div>
    </div>
  );
};

// Example standalone components usage
const StandaloneExamples = () => {
  const [userProfile, setUserProfile] = useState({});
  
  return (
    <div className="space-y-8 p-6">
      {/* Profile Photo Upload Example */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Profile Photo Upload</h2>
        <ProfilePhotoUpload
          currentPhoto={userProfile.profilePhoto}
          onPhotoUpdate={(photoData) => setUserProfile(prev => ({ ...prev, profilePhoto: photoData }))}
          isEditing={true}
        />
      </div>

      {/* Account Settings Example */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Account Settings</h2>
        <AccountSettings
          userProfile={userProfile}
          onUpdate={setUserProfile}
        />
      </div>

      {/* Notification Settings Example */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
        <NotificationSettings userId="user123" />
      </div>
    </div>
  );
};

export default ProfilePage;
export { StandaloneExamples };