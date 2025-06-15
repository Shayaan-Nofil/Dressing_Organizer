// backend/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const { addItem, getItems, deleteItem, lifecycleAction } = require('../controllers/itemController');
const auth = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/', auth, addItem);
router.get('/', auth, getItems);
router.delete('/:id', auth, deleteItem);
router.patch('/:id/lifecycle', auth, lifecycleAction);

module.exports = router;