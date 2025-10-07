import React, { useState, useEffect } from 'react';

const NotificationSettings = ({ userId }) => {
  const [notifications, setNotifications] = useState({
    // Email Notifications
    email: {
      propertyAlerts: true,
      priceUpdates: true,
      newListings: false,
      inquiryResponses: true,
      bookingUpdates: true,
      marketingEmails: false,
      weeklyDigest: true,
      monthlyReports: false
    },
    // SMS Notifications
    sms: {
      urgentAlerts: true,
      bookingConfirmations: true,
      paymentReminders: true,
      securityAlerts: true,
      maintenanceUpdates: false,
      marketingMessages: false
    },
    // Push Notifications
    push: {
      newMessages: true,
      propertyViews: true,
      inquiries: true,
      bookingRequests: true,
      paymentUpdates: true,
      systemUpdates: false,
      promotional: false
    },
    // In-App Notifications
    inApp: {
      comments: true,
      mentions: true,
      follows: true,
      likes: false,
      shares: false,
      recommendations: true
    }
  });

  const [scheduleSettings, setScheduleSettings] = useState({
    emailFrequency: 'immediate', // immediate, daily, weekly
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00'
    },
    workingDays: {
      enabled: false,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  });

  const [recentNotifications, setRecentNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data loading
  useEffect(() => {
    const loadNotificationSettings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock recent notifications
        setRecentNotifications([
          {
            id: 1,
            type: 'property_inquiry',
            title: 'New Property Inquiry',
            message: 'Someone is interested in your 2BHK apartment in Koramangala',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            read: false,
            channel: 'email'
          },
          {
            id: 2,
            type: 'booking_confirmed',
            title: 'Booking Confirmed',
            message: 'Your booking for Sky View Apartments has been confirmed',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            read: true,
            channel: 'sms'
          },
          {
            id: 3,
            type: 'price_alert',
            title: 'Price Drop Alert',
            message: 'Rent reduced by ₹5,000 for properties matching your criteria',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            read: true,
            channel: 'push'
          },
          {
            id: 4,
            type: 'weekly_digest',
            title: 'Weekly Property Digest',
            message: '15 new properties matching your preferences this week',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            read: true,
            channel: 'email'
          }
        ]);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotificationSettings();
  }, [userId]);

  const handleNotificationChange = (category, type, value) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const handleScheduleChange = (setting, value) => {
    if (setting.includes('.')) {
      const [parent, child] = setting.split('.');
      setScheduleSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setScheduleSettings(prev => ({
        ...prev,
        [setting]: value
      }));
    }
  };

  const handleWorkingDaysChange = (day) => {
    setScheduleSettings(prev => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        days: prev.workingDays.days.includes(day)
          ? prev.workingDays.days.filter(d => d !== day)
          : [...prev.workingDays.days, day]
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Notification settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (channel) => {
    try {
      // Simulate sending test notification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      alert(`Test ${channel} notification sent successfully!`);
    } catch (error) {
      console.error('Test notification error:', error);
      alert(`Failed to send test ${channel} notification.`);
    }
  };

  const markAsRead = (id) => {
    setRecentNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setRecentNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'property_inquiry': return '🏠';
      case 'booking_confirmed': return '✅';
      case 'price_alert': return '💰';
      case 'weekly_digest': return '📊';
      default: return '🔔';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
          {recentNotifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>

        {recentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔕</div>
            <p className="text-gray-500">No recent notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notification.channel === 'email' ? 'bg-blue-100 text-blue-800' :
                          notification.channel === 'sms' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {notification.channel}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
          <button
            onClick={() => handleTestNotification('email')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Send test email
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(notifications.email).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-xs text-gray-500">
                  {key === 'propertyAlerts' && 'Get notified about properties matching your criteria'}
                  {key === 'priceUpdates' && 'Receive alerts when property prices change'}
                  {key === 'newListings' && 'Be the first to know about new property listings'}
                  {key === 'inquiryResponses' && 'Get responses to your property inquiries'}
                  {key === 'bookingUpdates' && 'Stay updated on your booking status'}
                  {key === 'marketingEmails' && 'Receive promotional offers and updates'}
                  {key === 'weeklyDigest' && 'Weekly summary of relevant properties'}
                  {key === 'monthlyReports' && 'Monthly market insights and reports'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">SMS Notifications</h3>
          <button
            onClick={() => handleTestNotification('SMS')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Send test SMS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(notifications.sms).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-xs text-gray-500">
                  {key === 'urgentAlerts' && 'Critical notifications requiring immediate attention'}
                  {key === 'bookingConfirmations' && 'Confirmation messages for your bookings'}
                  {key === 'paymentReminders' && 'Reminders for upcoming payments'}
                  {key === 'securityAlerts' && 'Security-related notifications'}
                  {key === 'maintenanceUpdates' && 'Property maintenance notifications'}
                  {key === 'marketingMessages' && 'Promotional SMS messages'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange('sms', key, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
          <button
            onClick={() => handleTestNotification('push')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Send test notification
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(notifications.push).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-xs text-gray-500">
                  {key === 'newMessages' && 'New messages from other users'}
                  {key === 'propertyViews' && 'When someone views your property'}
                  {key === 'inquiries' && 'New inquiries about your properties'}
                  {key === 'bookingRequests' && 'New booking requests'}
                  {key === 'paymentUpdates' && 'Payment status notifications'}
                  {key === 'systemUpdates' && 'App updates and maintenance notices'}
                  {key === 'promotional' && 'Promotional push notifications'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange('push', key, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">In-App Notifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(notifications.inApp).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <p className="text-xs text-gray-500">
                  {key === 'comments' && 'Comments on your properties or posts'}
                  {key === 'mentions' && 'When someone mentions you'}
                  {key === 'follows' && 'New followers or connection requests'}
                  {key === 'likes' && 'Likes on your properties or posts'}
                  {key === 'shares' && 'When someone shares your content'}
                  {key === 'recommendations' && 'Property recommendations for you'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange('inApp', key, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Notification Schedule */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Schedule</h3>

        <div className="space-y-6">
          {/* Email Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Frequency
            </label>
            <select
              value={scheduleSettings.emailFrequency}
              onChange={(e) => handleScheduleChange('emailFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly digest</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>

          {/* Quiet Hours */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Quiet Hours</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={scheduleSettings.quietHours.enabled}
                  onChange={(e) => handleScheduleChange('quietHours.enabled', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable</span>
              </label>
            </div>

            {scheduleSettings.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={scheduleSettings.quietHours.startTime}
                    onChange={(e) => handleScheduleChange('quietHours.startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={scheduleSettings.quietHours.endTime}
                    onChange={(e) => handleScheduleChange('quietHours.endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Working Days */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Business Days Only</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={scheduleSettings.workingDays.enabled}
                  onChange={(e) => handleScheduleChange('workingDays.enabled', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable</span>
              </label>
            </div>

            {scheduleSettings.workingDays.enabled && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Select days to receive notifications:</p>
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button
                      key={day}
                      onClick={() => handleWorkingDaysChange(day)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        scheduleSettings.workingDays.days.includes(day)
                          ? 'bg-primary-100 text-primary-700 border border-primary-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;