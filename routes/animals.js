const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const Comment = require('../models/Comment');

// GET /api/animals — list all
router.get('/', async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/animals/:id — single animal
router.get('/:id', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) return res.status(404).json({ error: 'Not found' });
        res.json(animal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/animals/:id/comments — comments for one animal
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ animal: req.params.id });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/animals — create new animal
router.post('/', async (req, res) => {
    try {
        const animal = await Animal.create(req.body);
        res.status(201).json(animal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/animals/:id/comments — add a comment
router.post('/:id/comments', async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) return res.status(404).json({ error: 'Animal not found' });

        const comment = await Comment.create({
            ...req.body,
            animal: req.params.id,   // attach to the parent animal
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/animals/:id — update status (or other fields)
router.patch('/:id', async (req, res) => {
    try {
        const animal = await Animal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }  // return updated doc, enforce schema rules
        );
        if (!animal) return res.status(404).json({ error: 'Not found' });
        res.json(animal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;