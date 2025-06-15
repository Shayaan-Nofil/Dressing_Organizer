const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');

// Get recent activities for the logged-in user
router.get('/', auth, activityController.getRecentActivities);

module.exports = router;
