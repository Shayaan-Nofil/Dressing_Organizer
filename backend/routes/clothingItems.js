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

// Add or update tags
router.patch('/:id/tags', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.tags = req.body.tags || [];
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark/unmark as favorite
router.patch('/:id/favorite', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.favorite = req.body.favorite;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get unused items (not worn for 30+ days)
router.get('/unused', async (req, res) => {
  try {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 30);
    const items = await ClothingItem.find({ $or: [ { lastWorn: { $lt: threshold } }, { lastWorn: null } ] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get least-worn items (sorted by lastWorn asc)
router.get('/least-worn', async (req, res) => {
  try {
    const items = await ClothingItem.find().sort({ lastWorn: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get wear frequency stats
router.get('/stats/frequency', async (req, res) => {
  try {
    const items = await ClothingItem.find();
    const stats = items.map(item => ({
      id: item._id,
      name: item.name,
      lastWorn: item.lastWorn,
      timesWorn: item.timesWorn || 0
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search/filter items
router.get('/search', async (req, res) => {
  try {
    const query = {};
    if (req.query.tags) query.tags = { $in: req.query.tags.split(',') };
    if (req.query.color) query.color = req.query.color;
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = req.query.category;
    if (req.query.favorite) query.favorite = req.query.favorite === 'true';
    if (req.query.lastWornBefore) query.lastWorn = { $lt: new Date(req.query.lastWornBefore) };
    const items = await ClothingItem.find(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /:id/lifecycle - Lifecycle action (donate, restyle, replace)
const auth = require('../middleware/authMiddleware');
const { lifecycleAction } = require('../controllers/itemController');
router.patch('/:id/lifecycle', auth, lifecycleAction);

module.exports = router; 