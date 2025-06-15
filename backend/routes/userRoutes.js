// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, getCurrentUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Get current authenticated user's info
router.get('/me', auth, getCurrentUser);

// Update current authenticated user's info
router.put('/me', auth, updateUser);

module.exports = router;