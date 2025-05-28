const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'],
        required: true
    },
    color: String,
    brand: String,
    size: String,
    material: String,
    season: {
        type: [String],
        enum: ['spring', 'summer', 'fall', 'winter']
    },
    imageUrl: String,
    tags: [String],
    lastWorn: Date,
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
