// backend/models/Outfit.js
const mongoose = require('mongoose');
const outfitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  notes: String,
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Outfit', outfitSchema);