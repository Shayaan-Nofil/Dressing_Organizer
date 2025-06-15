const express = require('express');
const router = express.Router();
const Outfit = require('../models/Outfit');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all outfits
router.get('/', async (req, res) => {
  try {
    const outfits = await Outfit.find().populate('items');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one outfit
router.get('/:id', async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id).populate('items');
    if (outfit) {
      res.json(outfit);
    } else {
      res.status(404).json({ message: 'Outfit not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create outfit
router.post('/', upload.single('image'), async (req, res) => {
  const outfit = new Outfit({
    name: req.body.name,
    items: req.body.items,
    occasion: req.body.occasion,
    weather: req.body.weather,
    season: req.body.season,
    style: req.body.style,
    notes: req.body.notes,
    image: req.file ? req.file.path : null
  });

  try {
    const newOutfit = await outfit.save();
    res.status(201).json(newOutfit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update outfit
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'items') {
          outfit[key] = JSON.parse(req.body[key]);
        } else {
          outfit[key] = req.body[key];
        }
      }
    });

    // Update image if new one is uploaded
    if (req.file) {
      outfit.image = req.file.path;
    }

    const updatedOutfit = await outfit.save();
    res.json(updatedOutfit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete outfit
router.delete('/:id', async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    await outfit.remove();
    res.json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const outfitController = require('../controllers/outfitController');

// Mark outfit as worn (update lastWorn and wearHistory)
router.patch('/:id/mark-worn', outfitController.markOutfitWorn);

// Get outfits by occasion
router.get('/occasion/:occasion', async (req, res) => {
  try {
    const outfits = await Outfit.find({ occasion: req.params.occasion }).populate('items');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get outfits by season
router.get('/season/:season', async (req, res) => {
  try {
    const outfits = await Outfit.find({ season: req.params.season }).populate('items');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get outfit suggestions (items not yet paired together)
router.get('/suggestions', async (req, res) => {
  try {
    const Outfit = require('../models/Outfit');
    const ClothingItem = require('../models/ClothingItem');
    const allItems = await ClothingItem.find();
    const allOutfits = await Outfit.find();
    // Find all item pairs used in outfits
    const usedPairs = new Set();
    allOutfits.forEach(outfit => {
      for (let i = 0; i < outfit.items.length; i++) {
        for (let j = i + 1; j < outfit.items.length; j++) {
          usedPairs.add(`${outfit.items[i]}-${outfit.items[j]}`);
        }
      }
    });
    // Suggest new pairs not yet used
    const suggestions = [];
    for (let i = 0; i < allItems.length; i++) {
      for (let j = i + 1; j < allItems.length; j++) {
        const key = `${allItems[i]._id}-${allItems[j]._id}`;
        if (!usedPairs.has(key)) {
          suggestions.push([allItems[i], allItems[j]]);
        }
      }
    }
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get outfit history/analytics
router.get('/history', async (req, res) => {
  try {
    const outfits = await Outfit.find().populate('items').sort({ dateCreated: -1 });
    const history = outfits.map(outfit => ({
      id: outfit._id,
      name: outfit.name,
      items: outfit.items,
      rating: outfit.rating,
      notes: outfit.notes,
      dateCreated: outfit.dateCreated
    }));
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 