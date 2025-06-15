// backend/routes/outfitRoutes.js
const express = require('express');
const router = express.Router();
const { createOutfit, getOutfits, deleteOutfit, markOutfitWorn } = require('../controllers/outfitController');
const auth = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/', auth, createOutfit);
router.get('/', auth, getOutfits);
router.delete('/:id', auth, deleteOutfit);
router.patch('/:id/worn', auth, markOutfitWorn);

module.exports = router;
