const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// This pulls the key from Render's private "Environment" settings
// It is NOT visible to anyone looking at your GitHub
const MY_SECRET = process.env.MY_API_KEY; 

let tempDatabase = {};

app.post('/save', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    // Safety check: make sure the key exists and matches
    if (!apiKey || apiKey !== MY_SECRET) {
        console.log("Key mismatch or missing key!");
        return res.status(403).send("Forbidden");
    }

    const { userId, avatarData } = req.body;
    tempDatabase[userId] = avatarData;
    console.log(`Saved User: ${userId}`);
    res.status(200).send("Success");
});

app.get('/get-avatar/:id', (req, res) => {
    const data = tempDatabase[req.params.id];
    if (data) res.json(data);
    else res.status(404).send("Not Found");
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running securely`));
