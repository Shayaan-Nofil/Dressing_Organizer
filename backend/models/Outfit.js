const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClothingItem'
    }],
    occasion: String,
    weather: String,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateScheduled: Date,
    notes: String
});

module.exports = mongoose.model('Outfit', outfitSchema);
