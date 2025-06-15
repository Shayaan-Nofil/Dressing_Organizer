const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');

// Protect this route so only logged-in users can access their analytics
router.get('/', auth, getAnalytics);

module.exports = router;
