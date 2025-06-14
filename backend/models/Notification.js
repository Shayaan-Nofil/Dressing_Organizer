const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['reminder', 'info', 'warning'], default: 'reminder' },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' },
  relatedOutfit: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
