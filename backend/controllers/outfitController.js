const Outfit = require('../models/Outfit');
const activityController = require('./activityController');

exports.createOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.create(req.body);
    // Log activity
    if (req.user && req.user._id) {
      await activityController.logActivity(
        req.user._id,
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
    const outfits = await Outfit.find({ userId: req.params.userId }).populate('items');
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOutfit = async (req, res) => {
  try {
    const deletedOutfit = await Outfit.findByIdAndDelete(req.params.id);
    // Log activity
    if (deletedOutfit && req.user && req.user._id) {
      await activityController.logActivity(
        req.user._id,
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
    const outfit = await Outfit.findByIdAndUpdate(
      outfitId,
      {
        $set: { lastWorn: now },
        $push: { wearHistory: now }
      },
      { new: true }
    ).populate('items');
    if (!outfit) {
      return res.status(404).json({ error: 'Outfit not found' });
    }
    // Log activity
    if (req.user && req.user._id && outfit) {
      await activityController.logActivity(
        req.user._id,
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
