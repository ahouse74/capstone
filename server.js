require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://ahouse74.github.io',
    'https://capstone-server-production.up.railway.app/'
]

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

const animalRoutes = require('./routes/animals');
app.use('/api/animals', animalRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.error('DB connection failed:', err));