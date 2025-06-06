// backend/routes/outfitRoutes.js
const express = require('express');
const router = express.Router();
const { createOutfit, getOutfits, deleteOutfit } = require('../controllers/outfitController');

router.post('/', createOutfit);
router.get('/:userId', getOutfits);
router.delete('/:id', deleteOutfit);
module.exports = router;
