const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    lastWorn: {
        type: Date
    },
    notes: {
        type: String
    },
    season: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    size: {
        type: String
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        default: 'New'
    },
    purchaseDate: {
        type: Date
    },
    price: {
        type: Number
    },
    imageUrl: String,
    tags: [{ type: String }],
    favorite: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    dateAdded: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
