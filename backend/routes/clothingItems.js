const express = require('express');
const router = express.Router();
const ClothingItem = require('../models/ClothingItem');
const auth = require('../middleware/authMiddleware');
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

// Get all clothing items for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const items = await ClothingItem.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search/filter items for authenticated user
router.get('/search', auth, async (req, res) => {
  try {
    const query = { userId: req.user.id }; // Always filter by user
    if (req.query.tags) query.tags = { $in: req.query.tags.split(',') };
    if (req.query.color) query.color = req.query.color;
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = req.query.category;
    if (req.query.favorite) query.favorite = req.query.favorite === 'true';
    if (req.query.lastWornBefore) query.lastWorn = { $lt: new Date(req.query.lastWornBefore) };
    console.log('ClothingItem /search QUERY:', query, 'REQ:', req.query);
    const items = await ClothingItem.find(query);
    res.json(items);
  } catch (err) {
    console.error('Error in /search endpoint:', err.stack);
    res.status(500).json({ message: err.message, query: query, reqQuery: req.query });
  }
});

// Get unused items (not worn for 30+ days) for authenticated user
router.get('/unused', auth, async (req, res) => {
  try {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 30);
    const items = await ClothingItem.find({ 
      userId: req.user.id,
      $or: [ { lastWorn: { $lt: threshold } }, { lastWorn: null } ] 
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get least-worn items (sorted by lastWorn asc) for authenticated user
router.get('/least-worn', auth, async (req, res) => {
  try {
    const items = await ClothingItem.find({ userId: req.user.id }).sort({ lastWorn: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get wear frequency stats
router.get('/stats/frequency', auth, async (req, res) => {
  try {
    const items = await ClothingItem.find({ userId: req.user.id });
    const stats = items.map(item => ({
      _id: item._id,
      id: item._id,
      name: item.name,
      image: item.image,
      type: item.type,
      category: item.category,
      color: item.color,
      lastWorn: item.lastWorn,
      timesWorn: item.timesWorn || 0
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one clothing item (with ownership check)
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found or access denied' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create clothing item
router.post('/', auth, upload.single('image'), async (req, res) => {
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
    userId: req.user.id, // Set the owner
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
router.patch('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or access denied' });
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
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or access denied' });
    }
    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update last worn date
router.patch('/:id/last-worn', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!item) {
      return res.status(404).json({ message: 'Item not found or access denied' });
    }
    item.lastWorn = new Date();
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add or update tags
router.patch('/:id/tags', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!item) return res.status(404).json({ message: 'Item not found or access denied' });
    item.tags = req.body.tags || [];
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark/unmark as favorite
router.patch('/:id/favorite', auth, async (req, res) => {
  try {
    const item = await ClothingItem.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!item) return res.status(404).json({ message: 'Item not found or access denied' });
    item.favorite = req.body.favorite;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// PATCH /:id/lifecycle - Lifecycle action (donate, restyle, replace)
const { lifecycleAction } = require('../controllers/itemController');
router.patch('/:id/lifecycle', auth, lifecycleAction);

module.exports = router; 