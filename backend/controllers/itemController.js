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
