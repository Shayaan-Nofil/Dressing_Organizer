// backend/models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    size: String,
    style: String,
    notes: String,
  },
});
module.exports = mongoose.model('User', userSchema);