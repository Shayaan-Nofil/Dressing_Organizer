const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: String,
  color: String,
  brand: String,
  size: String,
  material: String,
  season: String,
  imageUrl: String,
  tags: [String],
});
module.exports = mongoose.model('Item', itemSchema);
