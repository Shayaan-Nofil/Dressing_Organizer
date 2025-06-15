const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClothingItem = require('../models/ClothingItem');
const Outfit = require('../models/Outfit');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/shared/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Share an outfit to social media
router.post('/share-outfit', auth, async (req, res) => {
  try {
    const { outfitId, platform, caption, privacy = 'public' } = req.body;
    
    const outfit = await Outfit.findOne({ _id: outfitId, user: req.user.id })
      .populate('items');
    
    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }
    
    // Generate shareable content
    const shareableContent = {
      id: outfit._id,
      title: outfit.name,
      caption: caption || `Check out my outfit: ${outfit.name}`,
      items: outfit.items.map(item => ({
        name: item.name,
        category: item.category,
        image: item.image
      })),
      privacy: privacy,
      sharedAt: new Date(),
      platform: platform,
      shareUrl: `${process.env.FRONTEND_URL}/shared/outfit/${outfit._id}`,
      user: {
        username: req.user.username || 'Anonymous User'
      }
    };
    
    // Save share record
    outfit.shares = outfit.shares || [];
    outfit.shares.push({
      platform: platform,
      sharedAt: new Date(),
      privacy: privacy,
      caption: caption
    });
    await outfit.save();
    
    res.json({
      message: 'Outfit shared successfully',
      shareData: shareableContent,
      platforms: {
        instagram: generateInstagramShareUrl(shareableContent),
        facebook: generateFacebookShareUrl(shareableContent),
        twitter: generateTwitterShareUrl(shareableContent),
        pinterest: generatePinterestShareUrl(shareableContent)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Share a clothing item
router.post('/share-item', auth, async (req, res) => {
  try {
    const { itemId, platform, caption, privacy = 'public' } = req.body;
    
    const item = await ClothingItem.findOne({ _id: itemId, user: req.user.id });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    const shareableContent = {
      id: item._id,
      title: item.name,
      caption: caption || `Check out my ${item.category}: ${item.name}`,
      image: item.image,
      category: item.category,
      privacy: privacy,
      sharedAt: new Date(),
      platform: platform,
      shareUrl: `${process.env.FRONTEND_URL}/shared/item/${item._id}`,
      user: {
        username: req.user.username || 'Anonymous User'
      }
    };
    
    // Save share record
    item.shares = item.shares || [];
    item.shares.push({
      platform: platform,
      sharedAt: new Date(),
      privacy: privacy,
      caption: caption
    });
    await item.save();
    
    res.json({
      message: 'Item shared successfully',
      shareData: shareableContent,
      platforms: {
        instagram: generateInstagramShareUrl(shareableContent),
        facebook: generateFacebookShareUrl(shareableContent),
        twitter: generateTwitterShareUrl(shareableContent),
        pinterest: generatePinterestShareUrl(shareableContent)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate shareable image for outfit or item
router.post('/generate-share-image', auth, upload.single('baseImage'), async (req, res) => {
  try {
    const { type, itemId, outfitId, template = 'modern' } = req.body;
    
    // In a real implementation, you would use image processing library like Sharp or Canvas
    // to create a shareable image with branding, user info, etc.
    
    // For now, return a mock response
    const shareImageData = {
      originalImage: req.file ? req.file.path : null,
      shareImageUrl: `/uploads/shared/share-${Date.now()}.jpg`,
      template: template,
      createdAt: new Date()
    };
    
    res.json({
      message: 'Share image generated successfully',
      shareImage: shareImageData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's privacy settings
router.get('/privacy-settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const privacySettings = user.privacySettings || {
      profileVisibility: 'public',
      allowItemSharing: true,
      allowOutfitSharing: true,
      showInDiscovery: true,
      allowMessaging: true,
      shareAnalytics: false
    };
    
    res.json(privacySettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update privacy settings
router.put('/privacy-settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.privacySettings = { ...user.privacySettings, ...req.body };
    await user.save();
    
    res.json({
      message: 'Privacy settings updated successfully',
      settings: user.privacySettings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get shared content (public view)
router.get('/shared/outfit/:id', async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id)
      .populate('items')
      .populate('user', 'username');
    
    if (!outfit) {
      return res.status(404).json({ message: 'Shared outfit not found' });
    }
    
    // Check if outfit is shared publicly
    const hasPublicShare = outfit.shares && outfit.shares.some(share => share.privacy === 'public');
    
    if (!hasPublicShare) {
      return res.status(403).json({ message: 'This outfit is not publicly shared' });
    }
    
    res.json({
      id: outfit._id,
      name: outfit.name,
      items: outfit.items.map(item => ({
        name: item.name,
        category: item.category,
        image: item.image
      })),
      user: outfit.user.username,
      sharedAt: outfit.shares.find(share => share.privacy === 'public').sharedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/shared/item/:id', async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id)
      .populate('user', 'username');
    
    if (!item) {
      return res.status(404).json({ message: 'Shared item not found' });
    }
    
    // Check if item is shared publicly
    const hasPublicShare = item.shares && item.shares.some(share => share.privacy === 'public');
    
    if (!hasPublicShare) {
      return res.status(403).json({ message: 'This item is not publicly shared' });
    }
    
    res.json({
      id: item._id,
      name: item.name,
      category: item.category,
      image: item.image,
      user: item.user.username,
      sharedAt: item.shares.find(share => share.privacy === 'public').sharedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's sharing history
router.get('/sharing-history', auth, async (req, res) => {
  try {
    const outfits = await Outfit.find({ 
      user: req.user.id, 
      shares: { $exists: true, $ne: [] }
    }).select('name shares createdAt');
    
    const items = await ClothingItem.find({ 
      user: req.user.id, 
      shares: { $exists: true, $ne: [] }
    }).select('name category shares createdAt');
    
    const sharingHistory = [
      ...outfits.map(outfit => ({
        type: 'outfit',
        id: outfit._id,
        name: outfit.name,
        shares: outfit.shares,
        createdAt: outfit.createdAt
      })),
      ...items.map(item => ({
        type: 'item',
        id: item._id,
        name: item.name,
        category: item.category,
        shares: item.shares,
        createdAt: item.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(sharingHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove shared content
router.delete('/unshare/:type/:id', auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let model;
    if (type === 'outfit') {
      model = Outfit;
    } else if (type === 'item') {
      model = ClothingItem;
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }
    
    const doc = await model.findOne({ _id: id, user: req.user.id });
    if (!doc) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    doc.shares = [];
    await doc.save();
    
    res.json({ message: 'Content unshared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper functions for generating share URLs
function generateInstagramShareUrl(content) {
  // Instagram doesn't support direct URL sharing, return instructions
  return {
    platform: 'instagram',
    instruction: 'Copy the image and caption to share on Instagram',
    caption: content.caption,
    hashtags: '#outfit #fashion #style #OOTD'
  };
}

function generateFacebookShareUrl(content) {
  const baseUrl = 'https://www.facebook.com/sharer/sharer.php';
  const params = new URLSearchParams({
    u: content.shareUrl,
    quote: content.caption
  });
  return `${baseUrl}?${params.toString()}`;
}

function generateTwitterShareUrl(content) {
  const baseUrl = 'https://twitter.com/intent/tweet';
  const params = new URLSearchParams({
    text: content.caption,
    url: content.shareUrl,
    hashtags: 'outfit,fashion,style,OOTD'
  });
  return `${baseUrl}?${params.toString()}`;
}

function generatePinterestShareUrl(content) {
  const baseUrl = 'https://pinterest.com/pin/create/button/';
  const params = new URLSearchParams({
    url: content.shareUrl,
    description: content.caption,
    media: content.image || ''
  });
  return `${baseUrl}?${params.toString()}`;
}

module.exports = router;
