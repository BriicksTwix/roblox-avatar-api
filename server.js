const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MY_SECRET = process.env.MY_API_KEY; 

// Simple in-memory storage
let tempDatabase = {};

// THE SAVE ROUTE
app.post('/save', (req, res) => {
    // Check the "x-api-key" header
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== MY_SECRET) {
        console.log("Unauthorized attempt blocked.");
        return res.status(403).send("Forbidden: Invalid API Key");
    }

    const { userId, avatarData } = req.body;
    if (!userId) return res.status(400).send("Missing UserId");

    tempDatabase[userId] = avatarData;
    console.log(`Successfully saved avatar for User: ${userId}`);
    res.status(200).send("Saved Successfully");
});

// THE GET ROUTE (For other games to fetch the avatar)
app.get('/get-avatar/:id', (req, res) => {
    const data = tempDatabase[req.params.id];
    if (data) {
        res.json(data);
    } else {
        res.status(404).send("No avatar found for this ID");
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live on port ${PORT}`);
});
