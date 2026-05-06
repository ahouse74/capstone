require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // parse JSON request bodies

// Routes
const animalRoutes = require('./routes/animals');
app.use('/api/animals', animalRoutes);

// Connect to MongoDB, then start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.error('DB connection failed:', err));