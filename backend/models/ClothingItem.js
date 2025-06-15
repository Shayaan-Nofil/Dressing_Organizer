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
    imageUrl: String,    tags: [{ type: String }],
    favorite: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For consistency with other models
    tags: [String],
    dateAdded: {
        type: Date,
        default: Date.now
    },
    wearCount: { type: Number, default: 0 },
    snoozeUnusedAlertUntil: { type: Date },
    shares: [{
        platform: { type: String, enum: ['instagram', 'facebook', 'twitter', 'pinterest', 'direct'] },
        sharedAt: { type: Date, default: Date.now },
        privacy: { type: String, enum: ['public', 'private', 'friends'], default: 'public' },
        caption: String,
        shareId: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
