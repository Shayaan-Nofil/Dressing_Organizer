// Utility to generate reminders for unused items and unrated outfits
const Notification = require('../models/Notification');
const ClothingItem = require('../models/ClothingItem');
const Outfit = require('../models/Outfit');
const mongoose = require('mongoose');

/**
 * Generate reminders for items not worn in X days and unrated outfits.
 * Should be called on a schedule (e.g., daily) or via an endpoint.
 */
async function generateRemindersForUser(userId, daysUnused = 30) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - daysUnused * 24 * 60 * 60 * 1000);
  // Unused items
  const unusedItems = await ClothingItem.find({ owner: userId, $or: [
    { lastWorn: { $exists: false } },
    { lastWorn: { $lt: cutoff } }
  ] });
  for (const item of unusedItems) {
    await Notification.findOneAndUpdate(
      { user: userId, relatedItem: item._id, type: 'reminder', message: { $regex: 'not worn' }, read: false },
      {
        user: userId,
        message: `You haven't worn "${item.name}" in over ${daysUnused} days!`,
        type: 'reminder',
        relatedItem: item._id,
        read: false,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
  }
  // Unrated outfits
  const unratedOutfits = await Outfit.find({ user: userId, $or: [ { rating: { $exists: false } }, { rating: null } ] });
  for (const outfit of unratedOutfits) {
    await Notification.findOneAndUpdate(
      { user: userId, relatedOutfit: outfit._id, type: 'reminder', message: { $regex: 'rate' }, read: false },
      {
        user: userId,
        message: `Don't forget to rate your outfit: "${outfit.name}"!`,
        type: 'reminder',
        relatedOutfit: outfit._id,
        read: false,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
  }
}

module.exports = { generateRemindersForUser };
