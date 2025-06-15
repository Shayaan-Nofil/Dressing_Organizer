const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['reminder', 'info', 'warning', 'event_reminder', 'calendar_sync', 'unused_item', 'outfit_suggestion', 'seasonal'], 
    default: 'reminder' 
  },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' },
  relatedOutfit: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' },
  metadata: {
    eventDate: Date,
    eventType: String,
    location: String,
    description: String,
    source: String,
    actionRequired: Boolean,
    expiresAt: Date
  },
  read: { type: Boolean, default: false },
  dismissed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
