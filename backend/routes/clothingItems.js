const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');
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

// Get all clothing items
router.get('/', async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one clothing item
router.get('/:id', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create clothing item
router.post('/', upload.single('image'), async (req, res) => {
  const item = new ClothingItem({
    name: req.body.name,
    type: req.body.type,
    category: req.body.category,
    color: req.body.color,
    season: req.body.season,
    brand: req.body.brand,
    size: req.body.size,
    condition: req.body.condition,
    purchaseDate: req.body.purchaseDate,
    price: req.body.price,
    notes: req.body.notes,
    image: req.file ? req.file.path : null
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update clothing item
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        item[key] = req.body[key];
      }
    });

    // Update image if new one is uploaded
    if (req.file) {
      item.image = req.file.path;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete clothing item
router.delete('/:id', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update last worn date
router.patch('/:id/last-worn', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    item.lastWorn = new Date();
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 