const express = require('express');
const app = express();
app.use(express.json());

// Render uses the PORT variable automatically; 10000 is the default fallback
const PORT = process.env.PORT || 10000;

// This pulls the key from your Render 'Environment' settings (hidden from GitHub)
const MY_SECRET = process.env.MY_API_KEY; 

// A simple object to store data while the server is running
// Note: On Render's free tier, this clears if the server 'sleeps' 
// To keep data forever, you'd eventually link this to a Database (like MongoDB)
let tempDatabase = {};

// 1. THE SAVE ROUTE (Used by your Editor Game)
app.post('/save', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    // Security check
    if (!apiKey || apiKey !== MY_SECRET) {
        console.log("Unauthorized request blocked: Key mismatch.");
        return res.status(403).send("Forbidden: Invalid Key");
    }

    const { userId, avatarData } = req.body;

    if (!userId || !avatarData) {
        return res.status(400).send("Bad Request: Missing data");
    }

    // Store the data using the userId as the key
    tempDatabase[userId] = avatarData;
    
    console.log(`Successfully saved data for UserID: ${userId}`);
    res.status(200).send("Success");
});

// 2. THE GET ROUTE (Used when a player rejoins or enters a new game)
app.get('/get-avatar/:id', (req, res) => {
    const userId = req.params.id;
    const data = tempDatabase[userId];
    
    if (data) {
        console.log(`Sending data for UserID: ${userId}`);
        res.json(data);
    } else {
        console.log(`No data found for UserID: ${userId}`);
        res.status(404).send("Not Found");
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is live and listening on port ${PORT}`);
});
