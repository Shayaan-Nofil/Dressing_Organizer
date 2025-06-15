const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['outfit_created', 'outfit_worn', 'item_added', 'item_deleted', 'outfit_deleted'],
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
