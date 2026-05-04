const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    lat: { type: Number },
    lng: { type: Number },
    label: { type: String },
}, { _id: false });

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['missing', 'caring', 'reunited'], default: 'missing' },
    photoUrl: { type: String, default: '' },
    location: { type: locationSchema },
    reportedBy: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);