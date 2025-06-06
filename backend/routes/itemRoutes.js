// backend/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const { addItem, getItems, deleteItem } = require('../controllers/itemController');

router.post('/', addItem);
router.get('/:userId', getItems);
router.delete('/:id', deleteItem);
module.exports = router;