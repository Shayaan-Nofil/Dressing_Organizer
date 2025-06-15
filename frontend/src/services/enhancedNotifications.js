import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Existing notification functions
export const getNotifications = async () => {
  const response = await axios.get(API_URL, getAuthHeader());
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await axios.patch(`${API_URL}/${notificationId}/read`, {}, getAuthHeader());
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  const response = await axios.delete(`${API_URL}/${notificationId}`, getAuthHeader());
  return response.data;
};

// Enhanced notification functions
export const getNotificationSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    // Return default settings if API fails
    return {
      unusedItemAlerts: true,
      unusedItemDays: 30,
      eventBasedSuggestions: true,
      advanceNoticeDays: 2,
      seasonalReminders: true,
      pushNotifications: false,
      emailNotifications: true
    };
  }
};

export const updateNotificationSettings = async (settings) => {
  const response = await axios.put(`${API_URL}/settings`, settings, getAuthHeader());
  return response.data;
};

export const createEventReminder = async (eventData) => {
  const response = await axios.post(`${API_URL}/event-reminder`, eventData, getAuthHeader());
  return response.data;
};

export const getUpcomingEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/upcoming-events`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
};

export const generateEventOutfitSuggestion = async (eventId) => {
  const response = await axios.post(`${API_URL}/event-outfit-suggestion`, { eventId }, getAuthHeader());
  return response.data;
};

// Calendar integration functions
export const connectGoogleCalendar = async (authCode) => {
  const response = await axios.post(`${API_URL}/connect-calendar`, { 
    provider: 'google', 
    authCode 
  }, getAuthHeader());
  return response.data;
};

export const disconnectCalendar = async () => {
  const response = await axios.delete(`${API_URL}/disconnect-calendar`, getAuthHeader());
  return response.data;
};

export const syncCalendarEvents = async () => {
  const response = await axios.post(`${API_URL}/sync-calendar`, {}, getAuthHeader());
  return response.data;
};

// Unused item tracking
export const getUnusedItemNotifications = async () => {
  const response = await axios.get(`${API_URL}/unused-items`, getAuthHeader());
  return response.data;
};

export const snoozeUnusedItemAlert = async (itemId, days = 7) => {
  const response = await axios.post(`${API_URL}/snooze-unused`, { itemId, days }, getAuthHeader());
  return response.data;
};

// Push notification registration
export const registerForPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      const response = await axios.post(`${API_URL}/register-push`, {
        subscription: subscription.toJSON()
      }, getAuthHeader());
      
      return response.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      throw error;
    }
  } else {
    throw new Error('Push notifications not supported');
  }
};

export const unregisterPushNotifications = async () => {
  const response = await axios.delete(`${API_URL}/unregister-push`, getAuthHeader());
  return response.data;
};
