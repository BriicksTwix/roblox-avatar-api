const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MY_SECRET = process.env.MY_API_KEY; 
const DATA_FILE = './database.json';
const RENDER_EXTERNAL_URL = "https://roblox-avatar-api.onrender.com";

let tempDatabase = {};
if (fs.existsSync(DATA_FILE)) {
    try {
        tempDatabase = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch (err) {
        console.error("Error loading database file:", err);
    }
}

const saveToFile = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tempDatabase, null, 2));
};

app.get('/ping', (req, res) => {
    res.status(200).send("Awake");
});

app.post('/save', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== MY_SECRET) return res.status(403).send("Invalid Key");

    const { userId, avatarData } = req.body;
    if (!userId || !avatarData) return res.status(400).send("Missing Data");

    tempDatabase[userId] = avatarData;
    saveToFile(); 
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
    
    setInterval(() => {
        https.get(`${RENDER_EXTERNAL_URL}/ping`, (res) => {
            console.log(`Self-ping sent to keep server awake. Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error("Self-ping error:", err.message);
        });
    }, 30000);
});
