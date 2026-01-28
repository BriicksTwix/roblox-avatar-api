const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const MY_SECRET = process.env.MY_API_KEY; // This pulls from Render's secret settings

let tempDatabase = {};

app.post('/save', (req, res) => {
    const apiKey = req.query.key;
    if (apiKey !== MY_SECRET) return res.status(403).send("Forbidden");

    const { userId, avatarData } = req.body;
    tempDatabase[userId] = avatarData;
    res.status(200).send("Saved");
});

app.get('/get-avatar/:id', (req, res) => {
    const data = tempDatabase[req.params.id];
    if (data) res.json(data);
    else res.status(404).send("Not Found");
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`));
