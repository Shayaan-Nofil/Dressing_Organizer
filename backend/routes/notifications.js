const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

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

module.exports = router;
