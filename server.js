const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MY_SECRET = process.env.MY_API_KEY; 

let tempDatabase = {};

// POST: /save (STAY PROTECTED)
app.post('/save', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== MY_SECRET) {
        return res.status(403).send("Invalid Key");
    }

    const { userId, avatarData } = req.body;
    if (!userId || !avatarData) {
        return res.status(400).send("Missing Data");
    }

    tempDatabase[userId] = avatarData;
    console.log(`Saved for ${userId}`);
    res.status(200).send("Success");
});

// GET: /get-avatar/:id (NOW PUBLIC - NO KEY REQUIRED)
app.get('/get-avatar/:id', (req, res) => {
    // Key check removed here so other games can load data
    const userId = req.params.id;
    const data = tempDatabase[userId];
    
    if (data) {
        res.json(data);
    } else {
        res.status(404).send("No data");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on ${PORT}`);
});
