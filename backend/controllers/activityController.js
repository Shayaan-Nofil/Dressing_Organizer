const Activity = require('../models/Activity');

// Log a new activity
exports.logActivity = async (user, type, relatedId, message) => {
  try {
    await Activity.create({ user, type, relatedId, message });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// Get recent activities for a user
exports.getRecentActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const activities = await Activity.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
