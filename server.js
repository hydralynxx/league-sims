require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Champion = require('./models/Champion');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.get('/api/champions', async (req, res) => {
    try {
        const champions = await Champion.find();
        res.json(champions);
    } catch (error) {
        res.status(500).send('Server Error: ', error);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
