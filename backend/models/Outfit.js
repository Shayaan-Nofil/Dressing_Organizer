const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClothingItem',
        required: true
    }],
    occasion: {
        type: String,
        required: true
    },
    weather: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    lastWorn: {
        type: Date
    },
    wearHistory: [{
        type: Date
    }],
    season: {
        type: String,
        required: true
    },
    style: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    image: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateScheduled: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Outfit', outfitSchema);
