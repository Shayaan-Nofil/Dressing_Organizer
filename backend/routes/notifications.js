const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const ClothingItem = require('../models/ClothingItem');
const auth = require('../middleware/authMiddleware');

// Get all notifications for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark a notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get notification settings
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const settings = user.notificationSettings || {
      unusedItemAlerts: true,
      unusedItemDays: 30,
      eventBasedSuggestions: true,
      advanceNoticeDays: 2,
      seasonalReminders: true,
      pushNotifications: false,
      emailNotifications: true
    };
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update notification settings
router.put('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.notificationSettings = req.body;
    await user.save();
    res.json(user.notificationSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create event reminder
router.post('/event-reminder', auth, async (req, res) => {
  try {
    const { title, date, time, type, location, description } = req.body;
    
    // Create notification for the event
    const notification = new Notification({
      user: req.user.id,
      title: `Upcoming Event: ${title}`,
      message: `Your ${type} event "${title}" is coming up on ${date} at ${time}. Don't forget to plan your outfit!`,
      type: 'event_reminder',
      metadata: {
        eventDate: new Date(`${date}T${time}`),
        eventType: type,
        location,
        description
      }
    });
    
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get upcoming events
router.get('/upcoming-events', auth, async (req, res) => {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30); // Next 30 days
    
    const eventNotifications = await Notification.find({
      user: req.user.id,
      type: 'event_reminder',
      'metadata.eventDate': { $gte: now, $lte: futureDate }
    }).sort({ 'metadata.eventDate': 1 });
    
    res.json(eventNotifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate event outfit suggestion
router.post('/event-outfit-suggestion', auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Notification.findById(eventId);
    
    if (!event || event.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get user's clothing items suitable for the event type
    const clothingItems = await ClothingItem.find({ 
      user: req.user.id,
      category: { $in: getSuitableCategories(event.metadata.eventType) }
    });
    
    // Simple suggestion logic - can be enhanced with AI
    const suggestion = {
      eventId: eventId,
      suggestions: clothingItems.slice(0, 3).map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        image: item.image
      })),
      message: `Here are some suggestions for your ${event.metadata.eventType} event!`
    };
    
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unused item notifications
router.get('/unused-items', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const unusedDays = user.notificationSettings?.unusedItemDays || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - unusedDays);
    
    const unusedItems = await ClothingItem.find({
      user: req.user.id,
      $or: [
        { lastWorn: { $lt: cutoffDate } },
        { lastWorn: { $exists: false } }
      ]
    }).select('name category image lastWorn');
    
    res.json(unusedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Snooze unused item alert
router.post('/snooze-unused', auth, async (req, res) => {
  try {
    const { itemId, days = 7 } = req.body;
    const item = await ClothingItem.findOne({ _id: itemId, user: req.user.id });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Update snooze until date
    const snoozeUntil = new Date();
    snoozeUntil.setDate(snoozeUntil.getDate() + days);
    
    item.snoozeUnusedAlertUntil = snoozeUntil;
    await item.save();
    
    res.json({ message: `Snoozed alert for ${days} days` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Calendar integration routes (mock implementation)
router.post('/connect-calendar', auth, async (req, res) => {
  try {
    const { provider, authCode } = req.body;
    
    // In a real implementation, you would:
    // 1. Exchange authCode for access token
    // 2. Store encrypted tokens in user profile
    // 3. Set up webhook for calendar changes
    
    const user = await User.findById(req.user.id);
    user.calendarIntegration = {
      provider: provider,
      connected: true,
      connectedAt: new Date()
    };
    await user.save();
    
    res.json({ message: 'Calendar connected successfully', provider });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/disconnect-calendar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.calendarIntegration = undefined;
    await user.save();
    
    res.json({ message: 'Calendar disconnected successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sync-calendar', auth, async (req, res) => {
  try {
    // Mock calendar sync - in real implementation, fetch from calendar API
    const mockEvents = [
      {
        title: 'Business Meeting',
        date: new Date(Date.now() + 86400000), // Tomorrow
        type: 'business'
      },
      {
        title: 'Wedding',
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        type: 'formal'
      }
    ];
    
    // Create notifications for synced events
    for (const event of mockEvents) {
      const notification = new Notification({
        user: req.user.id,
        title: `Calendar Event: ${event.title}`,
        message: `You have a ${event.type} event coming up. Would you like outfit suggestions?`,
        type: 'calendar_sync',
        metadata: {
          eventDate: event.date,
          eventType: event.type,
          source: 'calendar'
        }
      });
      await notification.save();
    }
    
    res.json({ message: 'Calendar synced successfully', eventsAdded: mockEvents.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Push notification registration (mock)
router.post('/register-push', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    const user = await User.findById(req.user.id);
    user.pushSubscription = subscription;
    await user.save();
    
    res.json({ message: 'Push notifications registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/unregister-push', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.pushSubscription = undefined;
    await user.save();
    
    res.json({ message: 'Push notifications unregistered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Trigger reminder generation for the logged-in user
const { generateRemindersForUser } = require('../utils/generateReminders');
router.post('/generate', auth, async (req, res) => {
  try {
    await generateRemindersForUser(req.user.id);
    res.json({ message: 'Reminders generated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to get suitable categories for event types
function getSuitableCategories(eventType) {
  const categoryMap = {
    business: ['suits', 'blazers', 'dress-shirts', 'dress-pants'],
    formal: ['dresses', 'suits', 'blazers', 'dress-shirts'],
    casual: ['t-shirts', 'jeans', 'sweaters', 'casual-pants'],
    party: ['dresses', 'blouses', 'stylish-tops', 'cocktail-dresses'],
    workout: ['activewear', 'sports-bras', 'athletic-shorts', 'sneakers'],
    outdoor: ['jackets', 'boots', 'outdoor-gear', 'weather-appropriate']
  };
  
  return categoryMap[eventType] || ['tops', 'bottoms', 'dresses'];
}

module.exports = router;
