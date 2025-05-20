const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://mongodb:27017';
const dbName = 'parking';

app.use(express.json());

let db, spotsCollection;

MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    spotsCollection = db.collection('spots');
    console.log("Connected to MongoDB");
  });

app.get('/spots', async (req, res) => {
  const spots = await spotsCollection.find().toArray();
  res.json(spots);
});

app.post('/spots', async (req, res) => {
  const { number, status } = req.body;
  await spotsCollection.updateOne(
    { number },
    { $set: { status, updatedAt: new Date() } },
    { upsert: true }
  );
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
