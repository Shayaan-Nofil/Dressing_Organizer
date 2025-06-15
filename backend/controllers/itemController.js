const ClothingItem = require('../models/ClothingItem');

exports.addItem = async (req, res) => {
  try {
    const item = await ClothingItem.create({
      ...req.body,
      user: req.user.id,
      dateAdded: new Date()
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await ClothingItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /:id/lifecycle - Lifecycle action (donate, restyle, replace)
exports.lifecycleAction = async (req, res) => {
  try {
    const { action } = req.body;
    const validActions = ['donate', 'restyle', 'replace'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action.' });
    }
    const item = await ClothingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found.' });
    // Update item status (you may want to add a status field to the schema for production)
    item.recommendation = action.charAt(0).toUpperCase() + action.slice(1);
    await item.save();
    // Log activity if available
    try {
      const Activity = require('../models/Activity');
      await Activity.create({
        user: req.user.id,
        type: 'item_' + action,
        relatedId: item._id,
        message: `${action.charAt(0).toUpperCase() + action.slice(1)} action for item: ${item.name}`
      });
    } catch (e) { /* ignore activity errors */ }
    res.json({ message: 'Action completed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
