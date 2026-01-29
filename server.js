const express = require('express');
const fs = require('fs'); // Added File System
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MY_SECRET = process.env.MY_API_KEY; 
const DATA_FILE = './database.json';

// Load existing data from file on startup
let tempDatabase = {};
if (fs.existsSync(DATA_FILE)) {
    tempDatabase = JSON.parse(fs.readFileSync(DATA_FILE));
}

// Helper to save data to file
const saveToFile = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tempDatabase, null, 2));
};

app.post('/save', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== MY_SECRET) return res.status(403).send("Invalid Key");

    const { userId, avatarData } = req.body;
    if (!userId || !avatarData) return res.status(400).send("Missing Data");

    tempDatabase[userId] = avatarData;
    saveToFile(); // Save to disk!
    console.log(`Saved for ${userId}`);
    res.status(200).send("Success");
});

app.get('/get-avatar/:id', (req, res) => {
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
