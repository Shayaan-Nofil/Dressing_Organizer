const Outfit = require('../models/Outfit');
const activityController = require('./activityController');

exports.createOutfit = async (req, res) => {
  try {
    const outfitData = {
      ...req.body,
      userId: req.user.id // Ensure the outfit belongs to the authenticated user
    };
    const outfit = await Outfit.create(outfitData);
    // Log activity
    if (req.user && req.user.id) {
      await activityController.logActivity(
        req.user.id,
        'outfit_created',
        outfit._id,
        `Created new outfit: ${outfit.name}`
      );
    }
    res.status(201).json(outfit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOutfits = async (req, res) => {
  try {
    // Only return outfits belonging to the authenticated user
    const outfits = await Outfit.find({ userId: req.user.id }).populate('items');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOutfit = async (req, res) => {
  try {
    const deletedOutfit = await Outfit.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!deletedOutfit) {
      return res.status(404).json({ error: 'Outfit not found or access denied' });
    }
    
    // Log activity
    if (req.user && req.user.id) {
      await activityController.logActivity(
        req.user.id,
        'outfit_deleted',
        deletedOutfit._id,
        `Deleted outfit: ${deletedOutfit.name}`
      );
    }
    res.status(200).json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark an outfit as worn (update lastWorn and add to wearHistory)
exports.markOutfitWorn = async (req, res) => {
  try {
    const outfitId = req.params.id;
    const now = new Date();
    const outfit = await Outfit.findOneAndUpdate(
      { _id: outfitId, userId: req.user.id },
      {
        $set: { lastWorn: now },
        $push: { wearHistory: now }
      },
      { new: true }
    ).populate('items');
    if (!outfit) {
      return res.status(404).json({ error: 'Outfit not found or access denied' });
    }
    // Log activity
    if (req.user && req.user.id && outfit) {
      await activityController.logActivity(
        req.user.id,
        'outfit_worn',
        outfit._id,
        `Marked outfit as worn: ${outfit.name}`
      );
    }
    res.json(outfit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
