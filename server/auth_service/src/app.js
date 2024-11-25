const express = require('express');
const connectDB = require('./auth_db.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
