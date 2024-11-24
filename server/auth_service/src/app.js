import express from 'express';
import connectDB from './auth_db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

app.get('/', (req, res) => {
  res.send('Authentication Microservice is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
