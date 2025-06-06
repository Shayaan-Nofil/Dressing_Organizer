const Outfit = require('../models/Outfit');

exports.createOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.create(req.body);
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
    await Outfit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Outfit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
