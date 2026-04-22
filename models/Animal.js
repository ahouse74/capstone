const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['available', 'adopted', 'pending'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);