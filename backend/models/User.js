const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  stylePreferences: [String],
  measurements: {
    height: Number,
    weight: Number,
    bust: Number,
    waist: Number,
    hips: Number
  },
  notificationSettings: {
    unusedItemAlerts: { type: Boolean, default: true },
    unusedItemDays: { type: Number, default: 30 },
    eventBasedSuggestions: { type: Boolean, default: true },
    advanceNoticeDays: { type: Number, default: 2 },
    seasonalReminders: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true }
  },
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
    allowItemSharing: { type: Boolean, default: true },
    allowOutfitSharing: { type: Boolean, default: true },
    showInDiscovery: { type: Boolean, default: true },
    allowMessaging: { type: Boolean, default: true },
    shareAnalytics: { type: Boolean, default: false }
  },
  calendarIntegration: {
    provider: String,
    connected: { type: Boolean, default: false },
    connectedAt: Date,
    accessToken: String, // Should be encrypted in production
    refreshToken: String // Should be encrypted in production
  },
  pushSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
